import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgHome = ({ fill = "#6E6E6E", width = 24, height = 24, ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" {...props}>
    <Path
      stroke={fill} // Use dynamic color for active/inactive state
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 15v-2.5M8.392 2.35 2.617 6.975c-.65.517-1.067 1.608-.925 2.425L2.8 16.033c.2 1.184 1.333 2.142 2.533 2.142h9.334c1.191 0 2.333-.967 2.533-2.142L18.308 9.4c.134-.817-.283-1.908-.925-2.425l-5.775-4.617c-.891-.716-2.333-.716-3.216-.008"
    />
  </Svg>
);

export default SvgHome;

