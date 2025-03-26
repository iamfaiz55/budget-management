declare module "react-native-svg-charts" {
  import { ComponentType } from "react";
  import { ViewProps } from "react-native";

  export interface PieChartProps extends ViewProps {
    data: any[];
    innerRadius?: string | number;
    outerRadius?: string | number;
  }

  export const PieChart: ComponentType<PieChartProps>;
}
