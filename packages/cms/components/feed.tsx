import { getCmsAdapter } from "../adapters";
import type { CmsUiComponents } from "../adapters/port";

export const Feed: CmsUiComponents["Feed"] = (props) =>
  getCmsAdapter().ui.Feed(props);
