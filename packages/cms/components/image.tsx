import { getCmsAdapter } from "../adapters";
import type { CmsUiComponents } from "../adapters/port";

export const Image: CmsUiComponents["Image"] = (props) =>
  getCmsAdapter().ui.Image(props);
