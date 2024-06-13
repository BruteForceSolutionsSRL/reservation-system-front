import {
  Document, 
  Image, 
  Page, 
  StyleSheet, 
  Text, 
  View 
} from "@react-pdf/renderer";
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
      width: "2.5cm"
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
    },
    textStyle: {
      textAlign: "left",
      fontSize: 9,
    },
    line: {
      width: "45%",
      textAlign: "left",
      borderBottomWidth: 1,
    },
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
          {reportData.acceptedRequests.length > 0 && (
            <View>
              <View style={{ paddingTop: 10 }}>
                <Text style={styles.textStyle}>
                  Reporte generado por estado de solicitud:
                </Text>
              </View>
              <View style={{ paddingTop: 10 }}>
                <Text style={styles.textStyle}>
                  Solicitudes Aceptadas:
                </Text>
              </View>
              <View style={{ paddingTop: 10 }}>
                { reportData &&
                  (<ReportTable report={reportData.acceptedRequests} />)
                }
              </View>
            </View>
          )}
          {reportData.rejectedRequests.length > 0 && (
            <View>
              <View style={{ paddingTop: 10 }}>
                <Text style={styles.textStyle}>
                  Solicitudes Rechazadas:
                </Text>
              </View>
              <View style={{ paddingTop: 10 }}>
                <ReportTable report={reportData.rejectedRequests} />
              </View>
            </View>
          )}
          {reportData.cancelledRequests.length > 0 && (
            <View>
              <View style={{ paddingTop: 10 }}>
                <Text style={styles.textStyle}>
                  Solicitudes Canceladas:
                </Text>
              </View>
              <View style={{ paddingTop: 10 }}>
                <ReportTable report={reportData.cancelledRequests} />
              </View>
            </View>
          )}
          <View style={{ paddingTop: 10 }}>
            <View style={styles.textStyle}>
              <Text>
                Total de solicitudes aprobadas: {reportData.accepted_reservations}
              </Text>
              <Text>
                Total de solicitudes rechazadas: {reportData.rejected_reservations}
              </Text>
              <Text style={styles.line}>
                Total de solicitudes canceladas: {reportData.cancelled_reservations}
              </Text>
              <Text>
                Total de solicitudes: {reportData.total_reservations}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

