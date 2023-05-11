import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Checkbox,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";
import { TableData } from "./components/TableData";
import {
  fetchVehicleData,
  fetchVehicleMakes,
  fetchVehicleTypes,
} from "./services/data.services";
import { checkYear, compareArrays } from "./utils/helper";

function App() {
  // state handles
  const [vehicelTypes, setVehicleTypes] = useState(null);
  const [vehicelType, setVehicleType] = useState("");
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [vehicleMake, setVehicleMake] = useState([]);
  const [yearFilter, setYearFilter] = useState({});
  const [yearError, setYearError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [searchValue, setSearchValue] = useState({});
  const [dataTable, setTableData] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchVehicleTypes().then((res) => {
      if (res.Results) setVehicleTypes(res.Results);
    });
  }, []);

  const vehicleMakeSetter = (val) => {
    fetchVehicleMakes(val?.toLowerCase()).then((res) => {
      if (res.Results) setVehicleMakes(res.Results);
    });
  };

  const handleVehicleTypeChange = ({ target: { value: newValue } }) => {
    setVehicleMakes([]);
    setVehicleMake([]);
    if (vehicelType !== newValue) {
      vehicleMakeSetter(newValue);
      setVehicleType(newValue);
    } else setVehicleType(null);
  };

  const handleVehicleMakeChange = (newValue) => {
    const arr = [...newValue];
    setVehicleMake(arr);
  };

  const handleYearCheck = ({ target: { checked } }) => {
    const obj = { ...yearFilter };
    setYearError("");
    obj["checked"] = checked;
    setYearFilter(obj);
  };

  const handleYearChange = (e) => {
    const {
      target: { value: newValue },
    } = e;
    e.target.value = e.target.value?.replace(/[^0-9]/gi, "");
    setYearError("");
    if (newValue?.length > 4)
      e.target.value = newValue?.split("").slice(0, 4).join("");
    if (newValue?.length !== 4 || isNaN(newValue) || !checkYear(newValue)) {
      setYearError("Please enter a valid year!!");
    } else {
      const obj = { ...yearFilter };
      obj["year"] = Number(newValue);
      setYearFilter(obj);
    }
  };

  useEffect(() => {
    if (
      yearError ||
      !vehicleMake?.length ||
      !vehicelType ||
      (yearFilter?.checked && !yearFilter?.year) ||
      (checkChanges() && dataTable)
    )
      setDisabled(true);
    else if (
      !yearError &&
      vehicleMake?.length &&
      vehicelType &&
      !checkChanges()
    )
      !yearFilter?.checked
        ? setDisabled(false)
        : yearFilter?.year && !yearError && setDisabled(false);
  }, [yearError, vehicleMake, vehicelType, yearFilter, dataTable]);

  const checkChanges = () => {
    let boolValue = true;
    if (
      !compareArrays(vehicleMake?.sort(), searchValue?.make?.sort()) ||
      vehicelType !== searchValue?.type
    )
      boolValue = false;
    if (yearFilter && searchValue) {
      if (
        yearFilter?.year !== searchValue?.year ||
        yearFilter?.checked !== searchValue?.checked
      )
        boolValue = false;
    }
    return boolValue;
  };

  const handleSubmit = async () => {
    const obj = { ...searchValue };
    obj["type"] = vehicelType;
    obj["make"] = vehicleMake;
    obj["year"] = yearFilter && yearFilter?.year;
    obj["checked"] = yearFilter && yearFilter?.checked;
    setSearchValue(obj);
    setLoader(true);
    const tableData = await fetchVehicleData(
      vehicelType,
      vehicleMake,
      yearFilter?.checked && yearFilter?.year
    );
    setTableData(tableData);
    setLoader(false);
  };

  return (
    <div className="App p-8 flex flex-col justify-center items-center w-full">
      <div className="text-3xl">Vehicle Search</div>
      <section className="flex gap-x-10 p-10 w-full">
        <section className="flex flex-col w-full text-left gap-y-4">
          <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
          <Select
            size="small"
            id="vehicle-type"
            labelId="vehicle-type-label"
            onChange={handleVehicleTypeChange}
          >
            {vehicelTypes?.map((vehicle) => (
              <MenuItem key={vehicle?.Id} value={vehicle?.Name}>
                {vehicle?.Name}
              </MenuItem>
            ))}
          </Select>
        </section>
        <section className="flex flex-col w-full text-left gap-y-4">
          <InputLabel id="vehicle-make-label">Make</InputLabel>
          <Autocomplete
            multiple
            id="make"
            size="small"
            freeSolo
            value={vehicleMake}
            options={vehicleMakes}
            getOptionLabel={(option) => option.MakeName}
            filterSelectedOptions
            renderInput={(params) => <TextField {...params} />}
            onChange={(event, value) => handleVehicleMakeChange(value)}
          />
        </section>
      </section>
      <section className="flex justify-start p-10 pt-0 items-center w-full text-left gap-x-4">
        <Checkbox onChange={handleYearCheck} aria-label="year-check" />
        <InputLabel id="vehicle-make-label">Filter by year:</InputLabel>
        <TextField
          size="small"
          onChange={handleYearChange}
          required={yearFilter["checked"]}
          disabled={!yearFilter["checked"]}
        />
        <Tooltip
          placement="right"
          title="Please enter any year between 1995 to current year"
        >
          <IconButton>
            <InfoOutlined />
          </IconButton>
        </Tooltip>
        <Typography variant="caption" className="text-red-600">
          {yearError}
        </Typography>
      </section>
      <section className="flex justify-start px-10 items-center w-full text-left gap-x-4 mb-10">
        <Button disabled={disabled} onClick={handleSubmit} variant="outlined">
          Search
        </Button>
      </section>
      <section className="h-96 w-full overflow-y-scroll">
        {dataTable && <TableData data={dataTable} loader={loader} />}
      </section>
    </div>
  );
}

export default App;
