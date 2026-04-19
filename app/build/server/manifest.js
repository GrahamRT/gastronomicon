const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.Bhew-6K9.js",app:"_app/immutable/entry/app.hTRSZScy.js",imports:["_app/immutable/entry/start.Bhew-6K9.js","_app/immutable/chunks/syqYlp1T.js","_app/immutable/chunks/CyEqhlU2.js","_app/immutable/chunks/DHHMTbse.js","_app/immutable/chunks/iH1LMhZ3.js","_app/immutable/entry/app.hTRSZScy.js","_app/immutable/chunks/CyEqhlU2.js","_app/immutable/chunks/ChrSXxB4.js","_app/immutable/chunks/DEjt3FpD.js","_app/immutable/chunks/iH1LMhZ3.js","_app/immutable/chunks/exSuILqr.js","_app/immutable/chunks/DeMqbOKP.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DXcJ0Gob.js')),
			__memo(() => import('./chunks/1-qKndExZq.js')),
			__memo(() => import('./chunks/2-BzOFWHIA.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/[...path]",
				pattern: /^\/api(?:\/([^]*))?\/?$/,
				params: [{"name":"path","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-B6t9X1um.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
