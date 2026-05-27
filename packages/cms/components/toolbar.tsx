import { getCmsAdapter } from "../adapters";
import type { CmsUiComponents } from "../adapters/port";

export const Toolbar: CmsUiComponents["Toolbar"] = () =>
  getCmsAdapter().ui.Toolbar();
