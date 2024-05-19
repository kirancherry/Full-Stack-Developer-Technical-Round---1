import React, { useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import './DataTableWithSearchSection.css'; // Import custom CSS file

const DataTableWithSearchSection = ({ columns, data, enableRowActions, renderRowActions }) => {
  console.log("data", data);
  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: false,
    enableColumnOrdering: false,
    enableGrouping: false,
    enableColumnPinning: false,
    enableFacetedValues: false,
    enableRowActions,
    enableRowSelection: false,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    renderRowActions,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [5,10, 50, 100, 200],
      shape: 'rounded',
      variant: 'outlined',
    },
  });

  const tableContainerStyle = {
    overflowX: 'auto',
    maxHeight: 'calc(100vh - 150px)',
  

  };

  return (
    <Container fluid>
      <Row>
        <Col lg={12} style={{ minWidth: "100%" }}>
          <div style={{tableContainerStyle }}>
            <MaterialReactTable table={table} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DataTableWithSearchSection;
