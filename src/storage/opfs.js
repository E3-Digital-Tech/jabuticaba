// src/storage/opfs.js
async function getRoot() {
  if (!("storage" in navigator) || !navigator.storage.getDirectory) {
    throw new Error("OPFS não suportado neste navegador.");
  }
  return await navigator.storage.getDirectory();
}

async function ensureDir(root, relativePath = "") {
  const parts = String(relativePath).split("/").filter(Boolean);
  let dir = root;
  for (const p of parts) {
    dir = await dir.getDirectoryHandle(p, { create: true });
  }
  return dir;
}

async function fileExists(dirHandle, name) {
  try {
    await dirHandle.getFileHandle(name, { create: false });
    return true;
  } catch {
    return false;
  }
}

export async function ensureUniqueName(dirHandle, base, ext = ".docx") {
  let name = `${base}${ext}`;
  let i = 1;
  while (await fileExists(dirHandle, name)) {
    name = `${base}-${i++}${ext}`;
  }
  return name;
}

export async function writeFile(path, blob) {
  const root = await getRoot();
  const parts = path.split("/").filter(Boolean);
  const filename = parts.pop();
  let dir = root;
  for (const p of parts) {
    dir = await dir.getDirectoryHandle(p, { create: true });
  }
  const fh = await dir.getFileHandle(filename, { create: true });
  const w = await fh.createWritable();
  await w.write(blob);
  await w.close();
}

export async function readFile(path) {
  const root = await getRoot();
  const parts = path.split("/").filter(Boolean);
  const filename = parts.pop();
  let dir = root;
  for (const p of parts) {
    dir = await dir.getDirectoryHandle(p, { create: false });
  }
  const fh = await dir.getFileHandle(filename, { create: false });
  return await fh.getFile(); // File (Blob)
}

export async function readJSON(path) {
  try {
    const f = await readFile(path);
    const txt = await f.text();
    const data = JSON.parse(txt);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeJSON(path, data) {
  await writeFile(path, new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
}

export async function listDocx(dirPath = "files") {
  const root = await getRoot();
  const dir = await ensureDir(root, dirPath);
  const items = [];
  // @ts-ignore - for await é suportado em DirectoryHandle
  for await (const [name, handle] of dir.entries()) {
    if (handle.kind === "file" && name.toLowerCase().endsWith(".docx")) {
      items.push({ name, path: `${dirPath}/${name}` });
    }
  }
  return items;
}
