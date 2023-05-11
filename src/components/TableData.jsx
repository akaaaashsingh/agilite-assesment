import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export const TableData = ({ data, loader }) => {
  return (
    <Table>
      <TableHead>
        <TableCell>Make Id</TableCell>
        <TableCell>Make Name</TableCell>
        <TableCell>Model Id</TableCell>
        <TableCell>Model Name</TableCell>
      </TableHead>
      <TableBody>
        {!loader ? (
          data?.map((entry) => (
            <TableRow>
              <TableCell>{entry.Make_ID}</TableCell>
              <TableCell>{entry.Make_Name}</TableCell>
              <TableCell>{entry.Model_ID}</TableCell>
              <TableCell>{entry.Model_Name}</TableCell>
            </TableRow>
          ))
        ) : (
          <p className="text-center flex w-full h-full relative top-40 items-center left-96 justify-center">
            Loading...
          </p>
        )}
      </TableBody>
    </Table>
  );
};
