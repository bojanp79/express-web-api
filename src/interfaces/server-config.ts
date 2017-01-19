export interface IServerConfig {
    useCors: boolean;
    port: number;
    exposeMetadata: boolean;
    publicFolder: string;
    controllersFolder: string;
}