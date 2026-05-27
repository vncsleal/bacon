import { getCmsAdapter } from "../adapters";
import type { CmsUiComponents } from "../adapters/port";

export const Body: CmsUiComponents["Body"] = (props) =>
  getCmsAdapter().ui.Body(props);
