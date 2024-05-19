import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const ReactDataTableWithSearch = ({ keyField, data, columns }) => {
  const options = {
    custom: false,
    paginationSize: 5,
    pageStartIndex: 1,
    withFirstAndLast: false,
    hidePageListOnlyOnePage: false,
    sizePerPage: 10
  };

  const defaultSorted = [{
    dataField: 'name',
    order: 'desc'
  }];


  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div style={{ maxHeight: "500px", overflowY: "scroll",overflowX: "hidden"  }}>
      <BootstrapTable
        {...paginationTableProps}
        keyField={keyField}
        data={data}
        columns={columns}
        bordered={false}
        wrapperClasses="table-responsive fontWeightTDs table-bordered"
        defaultSorted={defaultSorted}
        striped
        hover
        condensed
        headerWrapperClasses="foo"
      />
    </div>
  );
  
  return (
    <PaginationProvider pagination={paginationFactory(options)}>
      {contentTable}
    </PaginationProvider>
  );
};

export default ReactDataTableWithSearch;
