"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useServiceContainer = exports.useEpiserver = exports.Episerver = void 0;
const react_1 = __importStar(require("react"));
/**
 * The React Context object for the Episerver context
 *
 * @constant { React.Context<IEpiserverContext | undefined> } Episerver
 */
exports.Episerver = react_1.default.createContext(undefined);
exports.default = exports.Episerver;
/**
 * React Hook (for functional components) to retrieve the Episerver Context from
 * the nearest Provider in the virtual dom.
 *
 * @returns  { Core.IEpiserverContext }
 */
function useEpiserver() {
    const myContext = react_1.useContext(exports.Episerver);
    if (!myContext) {
        throw new Error('There\'s no Episerver Context provider above this component.');
    }
    return myContext;
}
exports.useEpiserver = useEpiserver;
/**
 * React Hook (for functional components) to retrieve the Episerver Service Container
 * from the nearest Provider in the virtual dom.
 *
 * @returns  { Core.IServiceContainer }
 */
function useServiceContainer() {
    const myContext = react_1.useContext(exports.Episerver);
    if (!myContext) {
        throw new Error('There\'s no Episerver Context provider above this component.');
    }
    return myContext.serviceContainer;
}
exports.useServiceContainer = useServiceContainer;
