import { Document, Page, Text, View, StyleSheet, Font, PDFViewer, Image } from '@react-pdf/renderer';
import { useState } from 'react';
import type { Invoice } from '@/app/finance/page';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';

// Optionally register a font for a more professional look
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYw.ttf' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYw.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 12,
    padding: 32,
    backgroundColor: '#fff',
    color: '#222',
  },
  header: {
    borderBottom: '2px solid #2563eb',
    marginBottom: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 18,
    color: '#2563eb',
    fontWeight: 700,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 4,
  },
  table: {
    display: 'flex', // Fix: use flex instead of table for @react-pdf/renderer
    width: 'auto',
    marginTop: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '60%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f1f5f9',
    padding: 6,
    fontWeight: 700,
  },
  tableCol: {
    width: '60%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    padding: 6,
  },
  tableColHeaderRight: {
    width: '40%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f1f5f9',
    padding: 6,
    fontWeight: 700,
    textAlign: 'right',
  },
  tableColRight: {
    width: '40%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    padding: 6,
    textAlign: 'right',
  },
  total: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2563eb',
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    marginTop: 32,
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
});

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              src="/images/logo.webp"
              style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }}
            />
            <View>
              <Text style={{ fontSize: 16, fontWeight: 700, color: '#6C5DD3' }}>AxesFlow</Text>
              <Text style={{ fontSize: 10, color: '#888' }}>Business Management Platform</Text>
              <Text style={{ fontSize: 10, color: '#888' }}>www.axesflow.com</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', letterSpacing: 2 }}>INVOICE</Text>
            <Text style={{ fontSize: 10, color: '#888', marginTop: 2 }}>Date: {invoice.issuedDate}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Invoice Number</Text>
          <Text style={styles.value}>{invoice.id}</Text>
          <Text style={styles.label}>Issued Date</Text>
          <Text style={styles.value}>{invoice.issuedDate}</Text>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.value}>{invoice.dueDate}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Billed To</Text>
          <Text style={styles.value}>{invoice.clientName}</Text>
          <Text style={styles.label}>Project</Text>
          <Text style={styles.value}>{invoice.projectName}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Description</Text>
            <Text style={styles.tableColHeaderRight}>Amount (INR)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{invoice.projectName}</Text>
            <Text style={styles.tableColRight}>₹{invoice.amount.toLocaleString('en-IN')}</Text>
          </View>
        </View>
        <Text style={styles.total}>Total: ₹{invoice.amount.toLocaleString('en-IN')}</Text>
        <Text style={styles.footer}>Thank you for your business!</Text>
      </Page>
    </Document>
  );
}

// Professional Invoice Actions Component
export function InvoicePDFActions({ invoice }: { invoice: Invoice }) {
  const [showPrint, setShowPrint] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <PDFDownloadLink
        document={<InvoicePDF invoice={invoice} />}
        fileName={`${invoice.id}.pdf`}
      >
        {({ loading }) => (
          <Button variant="outline">
            {loading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        )}
      </PDFDownloadLink>
      <Button variant="outline" onClick={() => setShowPrint(true)}>
        Print / Preview
      </Button>
      {showPrint && (
        <div style={{ position: 'fixed', zIndex: 1000, top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)' }}>
          <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: 16, borderRadius: 8, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <Button variant="outline" onClick={() => setShowPrint(false)}>Close</Button>
              <Button variant="outline" style={{ marginLeft: 8 }} onClick={() => window.print()}>Print</Button>
            </div>
            <div style={{ width: 800, height: 1100, border: '1px solid #eee', background: '#fff' }}>
              <PDFViewer width={"100%"} height={"100%"} showToolbar={true}>
                <InvoicePDF invoice={invoice} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
