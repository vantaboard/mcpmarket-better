declare module "*.less";

declare namespace GM {
  function openInTab(
    url: string,
    options?:
      | boolean
      | {
          active?: boolean;
          insert?: boolean | number;
          setParent?: boolean;
          loadInBackground?: boolean;
        },
  ): { close: () => void; closed: boolean };
}
