import React from "react";
import { View } from "react-native";
import * as Svg from 'react-native-svg';

const IconSvg = ({ width, height, icon, style }) => {


  // Esta función convertirá el XML de SVG a un componente de React Native SVG
  const renderSvg = (xml) => {
    // Aquí podrías usar una librería de terceros para convertir el XML a un objeto JSX
    // Por ejemplo, puedes usar 'react-native-svg-transformer' para transformar el SVG XML a un componente React Native
    // o escribir tu propio parser si es necesario.
    // Este ejemplo asume que ya tienes un método para convertir el XML a JSX.
    // Es importante notar que esta transformación no es trivial y puede requerir una configuración adicional.

    return (
      <Svg.SvgXml xml={xml} width={width} height={height} />
    );
  };

  return (
    <View style={style}>
      {renderSvg(icon)}
    </View>
  );
};

export default IconSvg;
