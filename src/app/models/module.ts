export interface IScript {
  index: string;
  arguments: string;
}

export interface IScriptResult {
  index: string;
  result: string;
}

export interface IModule extends IScript {
  title: string;
  description: string;
  fixed: boolean;
  icon?: string;
  background?: string;
  completed?: boolean;
  result?: string;
}

export interface IModuleGroup {
  title: string;
  gid: string;
  modules: IModule[];
}

export interface IConfig {
  url: string;
  groups: IModuleGroup[];
}
