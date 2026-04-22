import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import { ExternalBlob } from "../backend";

// No-op file upload/download since we're not using blob storage
const noopUpload = async (_file: ExternalBlob): Promise<Uint8Array> => {
  return new Uint8Array();
};

const noopDownload = async (_file: Uint8Array): Promise<ExternalBlob> => {
  return ExternalBlob.fromURL("");
};

const createBackendActor = (canisterId: string) =>
  createActor(canisterId, noopUpload, noopDownload);

export function useBackend() {
  const { actor, isFetching } = useActor(createBackendActor);
  return { actor, isFetching };
}
