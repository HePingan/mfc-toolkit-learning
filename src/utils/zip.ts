import { downloadBlob } from './download';

export type ZipManifestFile = {
  path: string;
  content: string;
};

export type ZipManifest = {
  rootName: string;
  files: ZipManifestFile[];
};

export async function downloadZipManifest(
  manifest: ZipManifest,
  filename = `${manifest.rootName}.zip`,
) {
  const JSZipModule = (await import('jszip')) as typeof import('jszip') & {
    default?: typeof import('jszip');
  };
  const ZipCtor = JSZipModule.default ?? JSZipModule;
  const zip = new ZipCtor();
  const root = zip.folder(manifest.rootName) ?? zip;
  manifest.files.forEach((file) => root.file(file.path, file.content));
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(filename, blob);
}
