import { StyleSheet, Text, View } from "@react-pdf/renderer";

export default function ReportTable({ report }) {
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
      width: "16.67%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 2,
      backgroundColor: "#E9ECEF",
    },
    tableCol: {
      width: "16.67%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 2,
    },
    tableCellHeader: {
      textAlign: "center",
      fontSize: 9,
      fontWeight: "bold",
    },
    tableCell: {
      textAlign: "center",
      fontSize: 9,
    },
  });

  return (
    <View>
      <View style={styles.table} key={1}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Docente</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Bloque</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Aula(s)</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Período de reserva</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Fecha solicitada</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Motivo de reserva</Text>
          </View>
        </View>
        {report?.map((row, i) => {
          return (
            <View style={styles.tableRow} key={i + 1} wrap={false}>
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
                  {row.date}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {row.reservation_reason}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  );
}

