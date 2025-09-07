// 'use client';

// import { useState, useCallback } from 'react';
// import DeckGL from '@deck.gl/react';
// import { HeatmapLayer } from '@deck.gl/aggregation-layers';
// import Map from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// const heatmapData = [
//   { position: [77.5946, 12.9716], weight: 1 },
//   { position: [72.8777, 19.0760], weight: 0.8 },
//   { position: [88.3639, 22.5726], weight: 0.6 },
//   { position: [72.5714, 23.0225], weight: 0.4 },
// ];

// export default function PrecisionTargeting() {
//   const [viewState, setViewState] = useState({
//     longitude: 78,
//     latitude: 22,
//     zoom: 4,
//     pitch: 30,
//     bearing: 0,
//   });

//   const _onViewStateChange = useCallback((params: any) => {
//     setViewState(params.viewState);
//   }, []);

//   const layers = [
//     new HeatmapLayer({
//       id: 'heatmap',
//       data: heatmapData,
//       getPosition: d => d.position,
//       getWeight:   d => d.weight,
//       radiusPixels: 60,
//     }),
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero */}
//       <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
//         <div className="space-y-6">
//           <h1 className="text-4xl lg:text-5xl font-extrabold">
//             Reach Customers <br />Where They Are
//           </h1>
//           <p className="text-lg text-gray-700">
//             Our AI-driven heatmaps show real-world foot traffic so you can serve ads exactly
//             where your customers go.
//           </p>
//           <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
//             Get Started
//           </button>
//         </div>

//         <div className="h-96 w-full rounded-xl overflow-hidden shadow-xl">
// <DeckGL
//   initialViewState={viewState}
//   controller={true}
//   layers={layers}
//   onViewStateChange={_onViewStateChange}
// >
//   <Map
//     reuseMaps
//     mapboxApiAccessToken={MAPBOX_TOKEN}
//     mapStyle="mapbox://styles/mapbox/light-v10"
//     width="100%"
//     height="100%"
//   />
//           </DeckGL>
//         </div>
//       </section>

//       {/* Benefits Grid */}
//       <section className="bg-gray-50 py-16">
//         <div className="max-w-5xl mx-auto px-6">
//           <ul className="grid md:grid-cols-3 gap-8">
//             <li className="p-6 bg-white rounded-lg shadow text-center">
//               {/* …icon & copy */}
//             </li>
//             {/* …other items */}
//           </ul>
//         </div>
//       </section>
//     </div>
//   );
// }
