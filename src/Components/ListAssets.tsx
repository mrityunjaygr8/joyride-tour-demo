import {
  Button,
  Container,
  Group,
  keyframes,
  MediaQuery,
  Modal,
  Text,
} from "@mantine/core";
import {
  Share2Icon,
  PlusIcon,
  DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";
import { forwardRef, useRef, useState } from "react";
import {
  BeaconRenderProps,
  CallBackProps,
  STATUS,
  Step,
  StoreHelpers,
} from "react-joyride";
import Joyride from "react-joyride";
import { useNavigate } from "react-router-dom";
import asset from "../Response/assets.json";
import AssetCard, { Asset } from "./assetCard";
import CreateAsset from "./CreateAsset";
import styled from "@emotion/styled";
import useStore from "../Store";
export interface State {
  complete: boolean;
  run: boolean;
  steps: Step[];
}
interface CheckedAssetsProps {
  unique_id: string;
  host: string;
}
const ListAssets = () => {
  const [checked, setChecked] = useState<CheckedAssetsProps[]>([]);
  const setCompleted = useStore((state) => state.setCompleted);
  const completed = useStore((state) => state.completed);
  const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  
  55% {
    background-color: rgba(48, 48, 232, 0.9);
    transform: scale(1.6);
  }
`;
  const BeaconButton = styled.button`
    animation: ${pulse} 1s ease-in-out infinite;
    background-color: rgba(48, 48, 232, 0.6);
    border: 0;
    border-radius: 50%;
    display: inline-block;
    height: 3rem;
    width: 3rem;
  `;

  const BeaconComponent = forwardRef<HTMLButtonElement, BeaconRenderProps>(
    (props, ref) => {
      return <BeaconButton ref={ref} {...props} />;
    }
  );
  const step = [
    {
      content: "Bulk Upload option to create more than one assets at a time",
      placementBeacon: "top" as const,
      target: "#bulk_upload",
      title: "Our awesome projects",
    },
    {
      content: "To create the Assets please click this button.",
      disableCloseOnEsc: true,
      disableOverlay: true,
      target: "#create_asset",
      title: "Create Asset",
    },
    {
      content: "To go one step back",
      placement: "top" as const,
      target: "#back_button",
      title: "Back one Step",
    },
  ];
  const [{ complete, run, steps }, setState] = useState<State>({
    complete: false,
    run: true,
    steps: step,
  });
  const helpers = useRef<StoreHelpers>();

  const setHelpers = (storeHelpers: StoreHelpers) => {
    helpers.current = storeHelpers;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const options: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (options.includes(status)) {
      setState({ complete: true, run: false, steps: [] });
      setCompleted("01");
    }
  };
  const handleClickRestart = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setCompleted("00");
    // const { reset } = helpers.current!;
    setState({ complete: false, run: true, steps: step });
    // reset(true);
  };

  const navigate = useNavigate();
  const icon_margin_right = { marginRight: "6px" };
  const [openCreate, setOpenCreate] = useState(false);
  return (
    <Container size="xl" style={{ marginLeft: "50px" }}>
      {completed?.charAt(1) == "0" && (
        <Joyride
          beaconComponent={BeaconComponent}
          callback={handleJoyrideCallback}
          getHelpers={setHelpers}
          run={run}
          scrollToFirstStep
          showSkipButton
          steps={steps}
          styles={{
            options: {
              zIndex: 2000000,
            },
            overlay: {
              backgroundColor: "rgba(79, 46, 8, 0.5)",
            },
          }}
        />
      )}
      <Group
        position="right"
        style={{ marginTop: "10px", marginBottom: "5px" }}
      >
        {completed?.charAt(1) == "1" && (
          <Button size="xs" color="red" onClick={handleClickRestart}>
            Restart tour
          </Button>
        )}
        <Button
          id="bulk_upload"
          data-testid="bulk_button"
          size="xs"
          onClick={() => setOpenCreate(true)}
        >
          <Share2Icon style={icon_margin_right} />
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Text size="xs">Bulk Upload</Text>
          </MediaQuery>
        </Button>
        <Button id="create_asset" size="xs" onClick={() => setOpenCreate(true)}>
          <PlusIcon style={icon_margin_right} />
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Text size="xs"> Create Asset </Text>
          </MediaQuery>
        </Button>
        <Button id="back_button" size="xs" onClick={() => navigate(-1)}>
          <DoubleArrowLeftIcon
            style={{ height: "25px", width: "25px", cursor: "pointer" }}
          />
          Back
        </Button>
      </Group>
      {asset.results?.map((e: Asset) => {
        return (
          <AssetCard
            key={e.unique_id}
            handleCheck={() => {}}
            asset={e}
            checked={!!checked.find((value) => value.unique_id == e.unique_id)}
          />
        );
      })}
      <Modal opened={openCreate} onClose={() => setOpenCreate(false)}>
        <CreateAsset setOpenCreate={setOpenCreate} />
      </Modal>
    </Container>
  );
};
export default ListAssets;
