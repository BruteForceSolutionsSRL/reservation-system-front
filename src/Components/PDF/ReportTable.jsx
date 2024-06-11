import { StyleSheet, Text, View } from "@react-pdf/renderer";

export default function ReportTable({ reportData }) {
  const styles = StyleSheet.create({
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableColHeader: {
      width: "14.28%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 2,
    },
    tableCol: {
      width: "14.28%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 2,
    },
    tableCellHeader: {
      textAlign: "center",
      fontSize: 11,
      fontWeight: "bold",
    },
    tableCell: {
      textAlign: "center",
      fontSize: 11,
    },
    summarizeSection: {
      textAlign: "left",
      fontSize: 11,
    },
    line: {
      borderBottomWidth: 1,
    }
  });

  const {
    accepted_reservations,
    rejected_reservations,
    canceled_reservations,
    total_reservations,
    report,
  } = reportData;

  return (
    <View>
      <View style={styles.table} key={1}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fecha</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Docente</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Bloque</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Aula</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Período de reserva</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fecha de envío</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fecha de aprobación</Text>
          </View>
        </View>

        {report?.map((row, i) => {
          return (
            <View style={styles.tableRow} key={i + 1} wrap={false}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.date}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.teacher}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.block_name}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.classrooms}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.time_slots}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.date_send}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.date_approval}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
      <View style={{ paddingTop: 10 }}>
        <View style={styles.summarizeSection}>
          <Text>Total de solicitudes aprobadas: {accepted_reservations}</Text>
          <Text>Total de solicitudes rechazadas: {rejected_reservations}</Text>
          <Text style={styles.line}>Total de solicitudes canceladas: {canceled_reservations}</Text>
          <Text>Total de solicitudes: {total_reservations}</Text>
        </View>
      </View>
    </View>
  );
}

