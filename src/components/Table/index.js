import React from "react";



const Table = ({keys, jsonData}) => {
  if (keys === undefined ){
    return (<p>Header of table is undefined</p>)
  }

  return (
    <table>
      <thead>
          <tr>
            {keys.map((data) => {
              return (
                <th key={data}>{data}</th>
              )
            })}
          </tr>
      </thead>
      <tbody>
        {jsonData === undefined || jsonData.length === 0 ?  <p> No Data in Table</p> : jsonData.map((tableData) => {
          let Row = [];

          for (let i = 0; i < keys.length; i += 1) {
            console.log(tableData[keys[i]])
            Row.push(
                <td>
                  {keys[i] === 'photo' ? <img alt="p" src={tableData[keys[i]]} /> : tableData[keys[i]]}
                </td>
            )
          }
          return (<tr key={tableData.id}>{[...Row]}</tr>)
        })}
      </tbody>
    </table>
  );
}

export default Table;
