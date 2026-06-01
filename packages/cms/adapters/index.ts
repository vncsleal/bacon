import { createLocalCmsData, createLocalCmsUi } from "./local";
import type { CmsDataPort, CmsUiComponents } from "./port";

const HAS_TOKEN = !!process.env.BASEHUB_TOKEN;

interface CmsAdapter {
  data: CmsDataPort;
  ui: CmsUiComponents;
}

let adapter: CmsAdapter | undefined;
const getRemoteImage = (): CmsUiComponents["Image"] => {
  const mod = require("basehub/next-image");
  return (props: import("./port").ImageProps) => mod.BaseHubImage(props);
};

const getRemoteBody = (): CmsUiComponents["Body"] => {
  const mod = require("basehub/react-rich-text");
  return (props: { readonly content: unknown[] }) => mod.RichText(props);
};

const createRemoteData = (): CmsDataPort => ({});

const createRemoteUi = (): CmsUiComponents => ({
  Feed: async ({ queries, children }) => {
    const { Pump } = await import("basehub/react-pump");
    return Pump({ queries, children } as unknown as Parameters<typeof Pump>[0]);
  },
  Toolbar: () => null,
  Image: (props) => {
    const Img = getRemoteImage();
    return Img(props);
  },
  Body: (props) => {
    const B = getRemoteBody();
    return B(props);
  },
});

export const getCmsAdapter = (): CmsAdapter => {
  if (adapter) {
    return adapter;
  }

  if (HAS_TOKEN) {
    adapter = {
      ui: createRemoteUi(),
      data: createRemoteData(),
    };
  } else {
    adapter = {
      ui: createLocalCmsUi(),
      data: createLocalCmsData(),
    };
  }

  return adapter;
};
