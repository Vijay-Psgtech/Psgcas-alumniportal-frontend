import { useMemo, useState } from "react";
import { Download, Upload, X } from "lucide-react";
import { adminAPI } from "../../services/api";

const IMPORT_FIELDS = [
  { key: "firstName", label: "First name", required: true, aliases: ["firstname", "first name", "given name"] },
  { key: "lastName", label: "Last name", aliases: ["lastname", "last name", "surname"] },
  { key: "email", label: "Email", required: true, aliases: ["email address", "e-mail"] },
  { key: "password", label: "Password" },
  { key: "department", label: "Department", required: true },
  { key: "batchYear", label: "Batch year", required: true, aliases: ["batch", "year", "graduation year"] },
  { key: "phone", label: "Phone", aliases: ["mobile", "mobile number"] },
  { key: "rollNumber", label: "Roll number", aliases: ["roll no", "roll no."] },
  { key: "gender", label: "Gender" },
  { key: "occupation", label: "Occupation" },
  { key: "programmeType", label: "Programme type", aliases: ["program type"] },
  { key: "degree", label: "Degree" },
  { key: "studyStartYear", label: "Study start year" },
  { key: "studyEndYear", label: "Study end year" },
  { key: "currentCompany", label: "Current company", aliases: ["company", "employer"] },
  { key: "jobTitle", label: "Job title", aliases: ["designation"] },
  { key: "industry", label: "Industry" },
  { key: "officeContact", label: "Office contact" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "fullAddress", label: "Full address", aliases: ["address"] },
  { key: "social.linkedin", label: "LinkedIn", aliases: ["linkedin url"] },
  { key: "social.twitter", label: "Twitter" },
  { key: "social.instagram", label: "Instagram" },
  { key: "social.facebook", label: "Facebook" },
  { key: "social.website", label: "Website", aliases: ["personal website"] },
  { key: "officeAddress.line1", label: "Office address line 1" },
  { key: "officeAddress.line2", label: "Office address line 2" },
  { key: "officeAddress.city", label: "Office city" },
  { key: "officeAddress.state", label: "Office state" },
  { key: "officeAddress.pincode", label: "Office pincode", aliases: ["postal code", "zip code"] },
  { key: "officeAddress.country", label: "Office country" },
];

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_ROWS = 1000;

const parseCSV = (content) => {
  const source = content.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  let lineNumber = 1;
  let rowStartLine = 1;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else if (character === "\r" || character === "\n") {
        value += character;
        if (character === "\r" && source[index + 1] === "\n") {
          value += "\n";
          index += 1;
        }
        lineNumber += 1;
      } else {
        value += character;
      }
    } else if (character === '"' && value === "") {
      quoted = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n" || character === "\r") {
      row.push(value);
      rows.push({ cells: row, rowNumber: rowStartLine });
      row = [];
      value = "";
      if (character === "\r" && source[index + 1] === "\n") index += 1;
      lineNumber += 1;
      rowStartLine = lineNumber;
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error("The CSV contains an unclosed quoted field.");
  row.push(value);
  if (row.some((cell) => cell.trim() !== "") || rows.length === 0) {
    rows.push({ cells: row, rowNumber: rowStartLine });
  }
  return rows;
};

const normalizeHeader = (header) =>
  String(header).trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

const autoMapHeaders = (headers) => {
  const mappedFields = new Set();
  return Object.fromEntries(
    headers.map((header, index) => {
      const normalized = normalizeHeader(header);
      const field = IMPORT_FIELDS.find(
        ({ key, label, aliases = [] }) =>
          !mappedFields.has(key) &&
          [key, label, ...aliases].some(
            (alias) => normalizeHeader(alias) === normalized,
          ),
      );
      if (field) mappedFields.add(field.key);
      return [index, field?.key || ""];
    }),
  );
};

const setMappedValue = (record, fieldPath, value) => {
  const [group, nestedField] = fieldPath.split(".");
  if (nestedField) {
    record[group] ||= {};
    record[group][nestedField] = value;
  } else {
    record[fieldPath] = value;
  }
};

const mapDataRows = (dataRows, mappings) =>
  dataRows.map(({ cells, rowNumber }) => {
    const record = {};
    Object.entries(mappings).forEach(([columnIndex, fieldPath]) => {
      if (!fieldPath) return;
      const value = cells[Number(columnIndex)];
      if (value !== undefined && String(value).trim() !== "") {
        setMappedValue(
          record,
          fieldPath,
          fieldPath === "password" ? String(value) : String(value).trim(),
        );
      }
    });
    return { rowNumber, record };
  });

const validateRows = (rows, mappings, departmentLocked) => {
  const requiredFields = IMPORT_FIELDS.filter(
    (field) => field.required && !(departmentLocked && field.key === "department"),
  );
  const mappedFields = new Set(Object.values(mappings).filter(Boolean));
  const missingFields = requiredFields
    .filter((field) => !mappedFields.has(field.key))
    .map((field) => field.label);
  const seenEmails = new Set();

  const validatedRows = rows.map(({ rowNumber, record }) => {
    const errors = missingFields.length
      ? [`Map required column(s): ${missingFields.join(", ")}`]
      : [];
    if (!record.firstName) errors.push("First name is required");
    if (!record.email) errors.push("Email is required");
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(record.email)) {
      errors.push("Email is invalid");
    }
    if (record.password && record.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!record.department && !departmentLocked) errors.push("Department is required");
    if (!record.batchYear) errors.push("Batch year is required");
    if (record.gender && !["male", "female", "other"].includes(record.gender.toLowerCase())) {
      errors.push("Gender must be Male, Female, or Other");
    }
    const email = record.email?.toLowerCase();
    if (email && seenEmails.has(email)) errors.push("Duplicate email in this file");
    if (email) seenEmails.add(email);
    return { rowNumber, record, errors };
  });

  return { missingFields, validatedRows };
};

const csvEscape = (value) => {
  const stringValue = String(value ?? "");
  return /[",\r\n]/.test(stringValue)
    ? `"${stringValue.replace(/"/g, '""')}"`
    : stringValue;
};

const downloadTemplate = () => {
  const headers = IMPORT_FIELDS.map(({ key }) => key);
  const blob = new Blob([headers.map(csvEscape).join(",")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "alumni-import-template.csv";
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function AlumniImportModal({
  onClose,
  onImported,
  departmentLocked = false,
  department = "",
}) {
  const [headers, setHeaders] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [mappings, setMappings] = useState({});
  const [fileName, setFileName] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [importResult, setImportResult] = useState(null);

  const rows = useMemo(() => mapDataRows(dataRows, mappings), [dataRows, mappings]);
  const { missingFields, validatedRows } = useMemo(
    () => validateRows(rows, mappings, departmentLocked),
    [rows, mappings, departmentLocked],
  );
  const invalidRows = validatedRows.filter((row) => row.errors.length);
  const previewRows = validatedRows.slice(0, 5);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setErrorMessage("");
    setImportResult(null);
    setFileName("");
    setHeaders([]);
    setDataRows([]);
    setMappings({});
    if (file.size > MAX_FILE_BYTES) {
      setErrorMessage("File exceeds the 2 MB limit.");
      return;
    }
    if (!/\.csv$/i.test(file.name)) {
      setErrorMessage("Choose a CSV file.");
      return;
    }

    setLoadingFile(true);
    try {
      const sheetRows = parseCSV(await file.text());
      const headerRow = sheetRows[0]?.cells || [];
      const nextHeaders = headerRow.map((value) => String(value).trim());
      if (!nextHeaders.length || nextHeaders.every((header) => !header)) {
        throw new Error("The first CSV row must contain column headers.");
      }

      const nextDataRows = sheetRows
        .slice(1)
        .filter(({ cells }) => cells.some((cell) => String(cell).trim() !== ""));
      if (!nextDataRows.length) throw new Error("The file contains no alumni rows.");
      if (nextDataRows.length > MAX_ROWS) {
        throw new Error(`Imports are limited to ${MAX_ROWS} rows per file.`);
      }

      setFileName(file.name);
      setHeaders(nextHeaders);
      setDataRows(nextDataRows);
      setMappings(autoMapHeaders(nextHeaders));
    } catch (error) {
      setHeaders([]);
      setDataRows([]);
      setMappings({});
      setErrorMessage(error.message || "Unable to read the selected file.");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleImport = async () => {
    if (missingFields.length) return;
    let importSucceeded = false;
    setSubmitting(true);
    setErrorMessage("");
    try {
      const payloadRows = validatedRows.map(({ rowNumber, record }) => ({
        ...record,
        _sourceRow: rowNumber,
        ...(departmentLocked ? { department } : {}),
      }));
      const response = await adminAPI.importAlumni(payloadRows);
      setImportResult(response.data);
      importSucceeded = true;
    } catch (error) {
      const partialResult = error.response?.data;
      if (typeof partialResult?.importedCount === "number") {
        setImportResult(partialResult);
        setErrorMessage(partialResult.message);
        importSucceeded = true;
      } else {
        setErrorMessage(
          partialResult?.message || error.message || "Unable to import alumni.",
        );
      }
    } finally {
      setSubmitting(false);
    }

    if (!importSucceeded) return;
    try {
      await onImported();
    } catch (error) {
      setErrorMessage(
        `Import completed, but the alumni list could not be refreshed: ${error.message}`,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="alumni-import-title"
        className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 sm:p-6">
          <div>
            <h2 id="alumni-import-title" className="text-xl font-bold text-slate-900">
              Import alumni
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Upload a CSV, map columns, validate the preview, and import approved records.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close import dialog">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">Required import fields</p>
            <p className="mt-1">
              First name, email, optional password (at least 6 characters if provided),{" "}
              {!departmentLocked && "department, "}and batch year.
              Alumni ID is generated automatically. Password values are never included in the preview.
            </p>
            {departmentLocked && (
              <p className="mt-1">Department is set to your admin scope: <strong>{department}</strong>.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Upload size={16} />
              {loadingFile ? "Reading file..." : "Choose CSV"}
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFile}
                disabled={loadingFile || submitting}
                className="sr-only"
              />
            </label>
            <button onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Download size={15} /> CSV template
            </button>
            {fileName && <span className="text-sm text-slate-600">{fileName} · {dataRows.length} rows</span>}
          </div>

          {headers.length > 0 && !importResult && (
            <>
              <div>
                <h3 className="mb-2 font-semibold text-slate-900">Map file columns</h3>
                <p className="mb-3 text-xs text-slate-500">Headers are matched automatically when recognized. Unmapped columns are ignored.</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {headers.map((header, index) => (
                    <label key={`${index}-${header}`} className="min-w-0">
                      <span className="mb-1 block truncate text-xs font-medium text-slate-600">{header || `Column ${index + 1}`}</span>
                      <select
                        value={mappings[index] || ""}
                        onChange={(event) => setMappings((current) => ({ ...current, [index]: event.target.value }))}
                        disabled={submitting}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Ignore column</option>
                        {IMPORT_FIELDS.map((field) => {
                          const usedElsewhere = Object.entries(mappings).some(
                            ([column, mappedField]) =>
                              column !== String(index) && mappedField === field.key,
                          );
                          return (
                          <option key={field.key} value={field.key} disabled={usedElsewhere}>
                            {field.label}{field.required ? " *" : ""}
                          </option>
                          );
                        })}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                  Preview · {validatedRows.length} records · {invalidRows.length} validation issues
                </div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-white text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-2">Row</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Department</th>
                      <th className="px-4 py-2">Batch</th>
                      <th className="px-4 py-2">Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map(({ rowNumber, record, errors }) => (
                      <tr key={rowNumber} className="border-t border-slate-100 align-top">
                        <td className="px-4 py-2">{rowNumber}</td>
                        <td className="px-4 py-2">{[record.firstName, record.lastName].filter(Boolean).join(" ") || "—"}</td>
                        <td className="px-4 py-2">{record.email || "—"}</td>
                        <td className="px-4 py-2">{departmentLocked ? department : record.department || "—"}</td>
                        <td className="px-4 py-2">{record.batchYear || "—"}</td>
                        <td className={`px-4 py-2 ${errors.length ? "text-red-600" : "text-emerald-700"}`}>
                          {errors.length ? errors.join("; ") : "Ready"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {validatedRows.length > 5 && <p className="px-4 py-2 text-xs text-slate-500">Showing the first 5 rows.</p>}
              </div>
              {missingFields.length > 0 && <p className="text-sm font-medium text-red-600">Map required field(s): {missingFields.join(", ")}</p>}
            </>
          )}

          {errorMessage && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}

          {importResult && (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">
                {importResult.message || "Import complete"}: {importResult.importedCount} imported, {importResult.skippedCount} skipped, {importResult.failedCount} failed.
              </p>
              {[...importResult.skipped, ...importResult.failed].slice(0, 10).map((issue, index) => (
                <p key={`${issue.row}-${index}`} className="text-sm text-slate-700">
                  Row {issue.row}: {issue.reason || issue.errors?.join(", ")}
                </p>
              ))}
              {importResult.skipped.length + importResult.failed.length > 10 && (
                <p className="text-xs text-slate-500">Only the first 10 skipped or failed rows are shown.</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {importResult ? "Done" : "Cancel"}
            </button>
            {!importResult && (
              <button
                onClick={handleImport}
                disabled={!dataRows.length || missingFields.length > 0 || invalidRows.length > 0 || submitting || loadingFile}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Importing..." : `Import ${validatedRows.length} Alumni`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
