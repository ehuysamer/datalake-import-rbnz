var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/handlers/status.js
var status_exports = {};
__export(status_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(status_exports);

// src/services/status.service.js
var status_service_default = async () => {
  return {
    message: "OK"
    //publicIp: await determineCurrentIp()
  };
};

// src/consts/httpStatus.js
var HTTP_STATUS_OK = 200;

// src/consts/mime.js
var MIME_JSON = "application/json";

// src/consts/headers.js
var HEADER_CONTENT_TYPE = "Content-Type";
var DEFAULT_HEADERS_JSON = {
  [HEADER_CONTENT_TYPE]: MIME_JSON
};

// src/handlers/status.js
async function handler(event, context) {
  const result = await status_service_default();
  return {
    statusCode: HTTP_STATUS_OK,
    body: JSON.stringify(result),
    headers: DEFAULT_HEADERS_JSON,
    isBase64Encoded: false
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=status.js.map
