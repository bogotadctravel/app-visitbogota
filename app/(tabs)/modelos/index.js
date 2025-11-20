import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import WebView from "react-native-webview";
function get_alias(str) {
  if (str) {
    str = str.replaceAll(/¡/g, "", str); //Signo de exclamación abierta.&iexcl;
    str = str.replaceAll(/'/g, "", str); //Signo de exclamación abierta.&iexcl;
    str = str.replaceAll(/!/g, "", str); //Signo de exclamación abierta.&iexcl;
    str = str.replaceAll(/¢/g, "-", str); //Signo de centavo.&cent;
    str = str.replaceAll(/£/g, "-", str); //Signo de libra esterlina.&pound;
    str = str.replaceAll(/¤/g, "-", str); //Signo monetario.&curren;
    str = str.replaceAll(/¥/g, "-", str); //Signo del yen.&yen;
    str = str.replaceAll(/¦/g, "-", str); //Barra vertical partida.&brvbar;
    str = str.replaceAll(/§/g, "-", str); //Signo de sección.&sect;
    str = str.replaceAll(/¨/g, "-", str); //Diéresis.&uml;
    str = str.replaceAll(/©/g, "-", str); //Signo de derecho de copia.&copy;
    str = str.replaceAll(/ª/g, "-", str); //Indicador ordinal femenino.&ordf;
    str = str.replaceAll(/«/g, "-", str); //Signo de comillas francesas de apertura.&laquo;
    str = str.replaceAll(/¬/g, "-", str); //Signo de negación.&not;
    str = str.replaceAll(/®/g, "-", str); //Signo de marca registrada.&reg;
    str = str.replaceAll(/¯/g, "&-", str); //Macrón.&macr;
    str = str.replaceAll(/°/g, "-", str); //Signo de grado.&deg;
    str = str.replaceAll(/±/g, "-", str); //Signo de más-menos.&plusmn;
    str = str.replaceAll(/²/g, "-", str); //Superíndice dos.&sup2;
    str = str.replaceAll(/³/g, "-", str); //Superíndice tres.&sup3;
    str = str.replaceAll(/´/g, "-", str); //Acento agudo.&acute;
    str = str.replaceAll(/µ/g, "-", str); //Signo de micro.&micro;
    str = str.replaceAll(/¶/g, "-", str); //Signo de calderón.&para;
    str = str.replaceAll(/·/g, "-", str); //Punto centrado.&middot;
    str = str.replaceAll(/¸/g, "-", str); //Cedilla.&cedil;
    str = str.replaceAll(/¹/g, "-", str); //Superíndice 1.&sup1;
    str = str.replaceAll(/º/g, "-", str); //Indicador ordinal masculino.&ordm;
    str = str.replaceAll(/»/g, "-", str); //Signo de comillas francesas de cierre.&raquo;
    str = str.replaceAll(/¼/g, "-", str); //Fracción vulgar de un cuarto.&frac14;
    str = str.replaceAll(/½/g, "-", str); //Fracción vulgar de un medio.&frac12;
    str = str.replaceAll(/¾/g, "-", str); //Fracción vulgar de tres cuartos.&frac34;
    str = str.replaceAll(/¿/g, "-", str); //Signo de interrogación abierta.&iquest;
    str = str.replaceAll(/×/g, "-", str); //Signo de multiplicación.&times;
    str = str.replaceAll(/÷/g, "-", str); //Signo de división.&divide;
    str = str.replaceAll(/À/g, "a", str); //A mayúscula con acento grave.&Agrave;
    str = str.replaceAll(/Á/g, "a", str); //A mayúscula con acento agudo.&Aacute;
    str = str.replaceAll(/Â/g, "a", str); //A mayúscula con circunflejo.&Acirc;
    str = str.replaceAll(/Ã/g, "a", str); //A mayúscula con tilde.&Atilde;
    str = str.replaceAll(/Ä/g, "a", str); //A mayúscula con diéresis.&Auml;
    str = str.replaceAll(/Å/g, "a", str); //A mayúscula con círculo encima.&Aring;
    str = str.replaceAll(/Æ/g, "a", str); //AE mayúscula.&AElig;
    str = str.replaceAll(/Ç/g, "c", str); //C mayúscula con cedilla.&Ccedil;
    str = str.replaceAll(/È/g, "e", str); //E mayúscula con acento grave.&Egrave;
    str = str.replaceAll(/É/g, "e", str); //E mayúscula con acento agudo.&Eacute;
    str = str.replaceAll(/Ê/g, "e", str); //E mayúscula con circunflejo.&Ecirc;
    str = str.replaceAll(/Ë/g, "e", str); //E mayúscula con diéresis.&Euml;
    str = str.replaceAll(/Ì/g, "i", str); //I mayúscula con acento grave.&Igrave;
    str = str.replaceAll(/Í/g, "i", str); //I mayúscula con acento agudo.&Iacute;
    str = str.replaceAll(/Î/g, "i", str); //I mayúscula con circunflejo.&Icirc;
    str = str.replaceAll(/Ï/g, "i", str); //I mayúscula con diéresis.&Iuml;
    str = str.replaceAll(/Ð/g, "d", str); //ETH mayúscula.&ETH;
    str = str.replaceAll(/Ñ/g, "n", str); //N mayúscula con tilde.&Ntilde;
    str = str.replaceAll(/Ò/g, "o", str); //O mayúscula con acento grave.&Ograve;
    str = str.replaceAll(/Ó/g, "o", str); //O mayúscula con acento agudo.&Oacute;
    str = str.replaceAll(/Ô/g, "o", str); //O mayúscula con circunflejo.&Ocirc;
    str = str.replaceAll(/Õ/g, "o", str); //O mayúscula con tilde.&Otilde;
    str = str.replaceAll(/Ö/g, "o", str); //O mayúscula con diéresis.&Ouml;
    str = str.replaceAll(/Ø/g, "o", str); //O mayúscula con barra inclinada.&Oslash;
    str = str.replaceAll(/Ù/g, "u", str); //U mayúscula con acento grave.&Ugrave;
    str = str.replaceAll(/Ú/g, "u", str); //U mayúscula con acento agudo.&Uacute;
    str = str.replaceAll(/Û/g, "u", str); //U mayúscula con circunflejo.&Ucirc;
    str = str.replaceAll(/Ü/g, "u", str); //U mayúscula con diéresis.&Uuml;
    str = str.replaceAll(/Ý/g, "y", str); //Y mayúscula con acento agudo.&Yacute;
    str = str.replaceAll(/Þ/g, "b", str); //Thorn mayúscula.&THORN;
    str = str.replaceAll(/ß/g, "b", str); //S aguda alemana.&szlig;
    str = str.replaceAll(/à/g, "a", str); //a minúscula con acento grave.&agrave;
    str = str.replaceAll(/á/g, "a", str); //a minúscula con acento agudo.&aacute;
    str = str.replaceAll(/â/g, "a", str); //a minúscula con circunflejo.&acirc;
    str = str.replaceAll(/ã/g, "a", str); //a minúscula con tilde.&atilde;
    str = str.replaceAll(/ä/g, "a", str); //a minúscula con diéresis.&auml;
    str = str.replaceAll(/å/g, "a", str); //a minúscula con círculo encima.&aring;
    str = str.replaceAll(/æ/g, "a", str); //ae minúscula.&aelig;
    str = str.replaceAll(/ç/g, "a", str); //c minúscula con cedilla.&ccedil;
    str = str.replaceAll(/è/g, "e", str); //e minúscula con acento grave.&egrave;
    str = str.replaceAll(/é/g, "e", str); //e minúscula con acento agudo.&eacute;
    str = str.replaceAll(/ê/g, "e", str); //e minúscula con circunflejo.&ecirc;
    str = str.replaceAll(/ë/g, "e", str); //e minúscula con diéresis.&euml;
    str = str.replaceAll(/ì/g, "i", str); //i minúscula con acento grave.&igrave;
    str = str.replaceAll(/í/g, "i", str); //i minúscula con acento agudo.&iacute;
    str = str.replaceAll(/î/g, "i", str); //i minúscula con circunflejo.&icirc;
    str = str.replaceAll(/ï/g, "i", str); //i minúscula con diéresis.&iuml;
    str = str.replaceAll(/ð/g, "i", str); //eth minúscula.&eth;
    str = str.replaceAll(/ñ/g, "n", str); //n minúscula con tilde.&ntilde;
    str = str.replaceAll(/ò/g, "o", str); //o minúscula con acento grave.&ograve;
    str = str.replaceAll(/ó/g, "o", str); //o minúscula con acento agudo.&oacute;
    str = str.replaceAll(/ô/g, "o", str); //o minúscula con circunflejo.&ocirc;
    str = str.replaceAll(/õ/g, "o", str); //o minúscula con tilde.&otilde;
    str = str.replaceAll(/ö/g, "o", str); //o minúscula con diéresis.&ouml;
    str = str.replaceAll(/ø/g, "o", str); //o minúscula con barra inclinada.&oslash;
    str = str.replaceAll(/ù/g, "o", str); //u minúscula con acento grave.&ugrave;
    str = str.replaceAll(/ú/g, "u", str); //u minúscula con acento agudo.&uacute;
    str = str.replaceAll(/û/g, "u", str); //u minúscula con circunflejo.&ucirc;
    str = str.replaceAll(/ü/g, "u", str); //u minúscula con diéresis.&uuml;
    str = str.replaceAll(/ý/g, "y", str); //y minúscula con acento agudo.&yacute;
    str = str.replaceAll(/þ/g, "b", str); //thorn minúscula.&thorn;
    str = str.replaceAll(/ÿ/g, "y", str); //y minúscula con diéresis.&yuml;
    str = str.replaceAll(/Œ/g, "d", str); //OE Mayúscula.&OElig;
    str = str.replaceAll(/œ/g, "-", str); //oe minúscula.&oelig;
    str = str.replaceAll(/Ÿ/g, "-", str); //Y mayúscula con diéresis.&Yuml;
    str = str.replaceAll(/ˆ/g, "", str); //Acento circunflejo.&circ;
    str = str.replaceAll(/˜/g, "", str); //Tilde.&tilde;
    str = str.replaceAll(/–/g, "", str); //Guiún corto.&ndash;
    str = str.replaceAll(/—/g, "", str); //Guiún largo.&mdash;
    str = str.replaceAll(/'/g, "", str); //Comilla simple izquierda.&lsquo;
    str = str.replaceAll(/'/g, "", str); //Comilla simple derecha.&rsquo;
    str = str.replaceAll(/,/g, "", str); //Comilla simple inferior.&sbquo;
    str = str.replaceAll(/"/g, "", str); //Comillas doble derecha.&rdquo;
    str = str.replaceAll(/"/g, "", str); //Comillas doble inferior.&bdquo;
    str = str.replaceAll(/†/g, "-", str); //Daga.&dagger;
    str = str.replaceAll(/‡/g, "-", str); //Daga doble.&Dagger;
    str = str.replaceAll(/…/g, "-", str); //Elipsis horizontal.&hellip;
    str = str.replaceAll(/‰/g, "-", str); //Signo de por mil.&permil;
    str = str.replaceAll(/‹/g, "-", str); //Signo izquierdo de una cita.&lsaquo;
    str = str.replaceAll(/›/g, "-", str); //Signo derecho de una cita.&rsaquo;
    str = str.replaceAll(/€/g, "-", str); //Euro.&euro;
    str = str.replaceAll(/™/g, "-", str); //Marca registrada.&trade;
    str = str.replaceAll(/ & /g, "-", str); //Marca registrada.&trade;
    str = str.replaceAll(/\(/g, "-", str);
    str = str.replaceAll(/\)/g, "-", str);
    str = str.replaceAll(/�/g, "-", str);
    str = str.replaceAll(/\//g, "-", str);
    str = str.replaceAll(":", "", str);
    str = str.replaceAll(/ de /g, "-", str); //Espacios
    str = str.replaceAll(/ y /g, "-", str); //Espacios
    str = str.replaceAll(/ a /g, "-", str); //Espacios
    str = str.replaceAll(/ DE /g, "-", str); //Espacios
    str = str.replaceAll(/ A /g, "-", str); //Espacios
    str = str.replaceAll(/ Y /g, "-", str); //Espacios
    str = str.replaceAll(/ /g, "-", str); //Espacios
    str = str.replaceAll(/  /g, "-", str); //Espacios
    str = str.replaceAll(/\./g, "", str); //Punto
    str = str.replaceAll("’", "", str);
    str = str.replaceAll("‘", "", str);
    str = str.replaceAll("“", "", str);
    str = str.replaceAll("”", "", str);
    str = str.replaceAll("+", "", str);
    str = str.replaceAll("&", "", str);
    str = str.replaceAll("amp;", "", str);
    str = str.replaceAll("?", "", str);
    str = str.replaceAll("¿", "", str);
    str = str.replaceAll("'", "", str);
    str = str.replaceAll("`", "", str);
    str = str.replaceAll("`", "", str);
    str = str.replaceAll("`", "", str);

    // Crear un objeto para mapeo de caracteres con tildes a sin tildes
    const accentsMap = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      Á: "A",
      É: "E",
      Í: "I",
      Ó: "O",
      Ú: "U",
      ñ: "n",
      Ñ: "N",
      ü: "u",
      Ü: "U",
    };

    // Normalizar la cadena para combinar caracteres base y tildes
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Reemplazar caracteres con tildes por sus equivalentes sin tildes
    str = str
      .split("")
      .map((char) => accentsMap[char] || char)
      .join("");

    //Mayusculas
    str = str.toLowerCase();

    return str;
  }
}
const ModelosScreen = ({}) => {
  // "https://visitbogota.co/realidad-aumentada/cerro-de-monserrate--204"
  const { atractivoName, atractivoId } = useLocalSearchParams();
  return (
    <View>
      <View
        style={{
          height: Dimensions.get("screen").height - 250,
          width: Dimensions.get("screen").width,
        }}
      >
        <WebView
          scalesPageToFit
          javaScriptEnabled
          style={{
            height: Dimensions.get("screen").height - 250,
            width: Dimensions.get("screen").width,
          }}
          originWhitelist={["*"]}
          source={{
            html: `<iframe allowfullscreen="allowfullscreen" height="100%" frameBorder="0" src="https://visitbogota.co/realidad-aumentada-app/${get_alias(
              atractivoName
            )}-${atractivoId}" width="100%"></iframe>`,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ModelosScreen;
