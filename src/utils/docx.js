import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

// aceita URL (string) ou ArrayBuffer
export async function generateContractFromTemplate(form, templateSrc = "/contrato_modelo.docx") {
  let arrayBuffer;

  if (typeof templateSrc === "string") {
    // cache buster + no-store
    const bust = templateSrc.includes("?") ? "&" : "?";
    const response = await fetch(`${templateSrc}${bust}v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Falha ao carregar template: ${templateSrc}`);
    arrayBuffer = await response.arrayBuffer();
  } else if (templateSrc instanceof ArrayBuffer) {
    arrayBuffer = templateSrc;
  } else {
    throw new Error("templateSrc inválido (esperado URL ou ArrayBuffer).");
  }

  const zip = new PizZip(arrayBuffer);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(form);

  const blob = doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveAs(blob, "Contrato_Preenchido.docx");
}
