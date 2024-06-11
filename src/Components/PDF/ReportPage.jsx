import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import logoFcyt from "../../assets/img/logoFcyt.png";
import ReportTable from "./ReportTable";

export default function ReportPage({ startDate, endDate, reportData }) {
  const styles = StyleSheet.create({
    page: {
      paddingTop: "2cm",
      paddingBottom: "2cm",
      paddingRight: "2cm",
      paddingLeft: "2cm"
    },
    logo: {
      width: "3cm"
    },
    header: {
      display: "flex",
      flexDirection: "row",
      fontSize: "14",
    },
    textHeader: {
      paddingLeft: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View>
          <View style={styles.header}>
            <Image src={logoFcyt} style={styles.logo} />
            <View style={styles.textHeader}>
              <Text>
                SISTEMA UNIVERSITARIO DE RESERVA DE AMBIENTES
              </Text>
              <Text>
                REPORTE DE USO DE AMBIENTE
              </Text>
              <Text>
                Administrador FCyT
              </Text>
              <Text>
                {startDate} - {endDate}
              </Text>
            </View>
          </View>
          <View style={{ paddingTop: 20 }}>
            { reportData &&
              (<ReportTable reportData={reportData} />)
            }
          </View>
        </View>
      </Page>
    </Document>
  );
}

