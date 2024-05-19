import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTableWithSearchSection from "./DataTableWithSearch";
import { Card, Col, Row, Modal, Form, Button } from "react-bootstrap";
import { Box, Tooltip } from "@mui/material";
import { IconButton } from "@mui/material";
import ModeEditOutlineSharpIcon from "@mui/icons-material/ModeEditOutlineSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AllScenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [positionXError, setPositionXError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarioForm, setScenarioForm] = useState({
    id: "",
    name: "",
    time: "",
  });
  const [vehicleForm, setVehicleForm] = useState({
    scenarios_id: "",
    id: "",
    name: "",
    positionX: "",
    positionY: "",
    speed: "",
    direction: "",
  });
  const [positionYError, setPositionYError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/scenarios")
      .then((response) => {
        setScenarios(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the scenarios!", error);
      });

    axios
      .get("http://localhost:5000/vehicles")
      .then((response) => {
        setVehicles(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the vehicles!", error);
      });
  }, []);

  const handleDelete = (scenarioId) => {
    // Delete vehicles associated with the scenario
    const vehiclesToDelete = vehicles.filter(vehicle => vehicle.scenarios_id === scenarioId);
  
    const deleteVehiclesPromises = vehiclesToDelete.map(vehicle => 
      axios.delete(`http://localhost:5000/vehicleDelete/${vehicle.id}`)
    );
  
    Promise.all(deleteVehiclesPromises)
      .then(() => {
        // After deleting vehicles, delete the scenario
        axios
          .delete(`http://localhost:5000/scenarioDelete/${scenarioId}`)
          .then(() => {
            setScenarios(scenarios.filter((scenario) => scenario.id !== scenarioId));
            setVehicles(vehicles.filter(vehicle => vehicle.scenarios_id !== scenarioId));
          })
          .catch((error) => {
            console.error("There was an error deleting the scenario!", error);
          });
      })
      .catch((error) => {
        console.error("There was an error deleting the vehicles!", error);
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScenarioForm({ ...scenarioForm, [name]: value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "positionX") {
      if (value > 800 || value < 0) {
        setPositionXError("Position X must be between 0 and 800");
      } else {
        setPositionXError("");
      }
    }
    if (name === "positionY") {
      if (value > 800 || value < 0) {
        setPositionYError("Position Y must be between 0 and 800");
      } else {
        setPositionYError("");
      }
    }
    setVehicleForm((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };


  

  const handleEdit = (scenario) => {
    setScenarioForm(scenario);
    setSelectedScenario(scenario.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setScenarioForm({ id: "", name: "", time: "" });
    setSelectedScenario(null);
  };

  const handleSaveScenario = () => {
    axios
      .put(
        `http://localhost:5000/scenarioEdit/${selectedScenario}`,
        scenarioForm
      )
      .then((response) => {
        setScenarios(
          scenarios.map((scenario) =>
            scenario.id === selectedScenario ? response.data : scenario
          )
        );
        handleCloseModal();
      })
      .catch((error) => {
        console.error("There was an error updating the scenario!", error);
      });
  };



  const getVehicleCount = (scenarioId) => {
    return vehicles.filter((vehicle) => vehicle.scenarios_id === scenarioId)
      .length;
  };

  const handleAddVehicle = (scenarioId) => {
    setVehicleForm({ ...vehicleForm, scenarios_id: scenarioId });
    setShowAddVehicleModal(true);
  };





  const handleCloseAddVehicleModal = () => {
    setShowAddVehicleModal(false);
    setVehicleForm({
      name: "",
      positionX: "",
      positionY: "",
      speed: "",
      direction: "",
      scenarios_id: "",
    });
  };

  const handleSaveVehicle = () => {
    axios
      .post("http://localhost:5000/vehicles", vehicleForm)
      .then((response) => {
        setVehicles([...vehicles, response.data]);
        handleCloseAddVehicleModal();
      })
      .catch((error) => {
        console.error("There was an error adding the vehicle!", error);
      });
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm({ ...vehicleForm, [name]: value });
  };

  const handleScenarioChange = (e) => {
    setSelectedScenario(e.target.value);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Scenario Id",
      },
      {
        accessorKey: "name",
        header: "Scenario Name",
      },
      {
        accessorKey: "time",
        header: "Time",
      },
      {
        accessorKey: "vehicleCount",
        header: "Number of Vehicles",
      },
      {
        accessorKey: "AddIcon",
        header: "Add Vehicles",
        Cell: ({ row }) => (
          <Tooltip title="Add Vehicle">
            <IconButton
              onClick={() => handleAddVehicle(row.original.id)}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const data = scenarios.map((scenario) => ({
    id: scenario.id,
    name: scenario.name,
    time: scenario.time,
    vehicleCount: getVehicleCount(scenario.id),
  }));

  const renderRowActions = ({ row }) => (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <Tooltip title="Delete">
        <IconButton onClick={() => handleDelete(row.original.id)}>
          <DeleteIcon className="text-danger" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton onClick={() => handleEdit(row.original)}>
          <ModeEditOutlineSharpIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Row>
      <Col sm={12}>
        <Card className="" style={{ backgroundColor: "rgb(243,248,244)" }}>
          <Card.Body style={{
            background: "#213046",
            color: "#fff",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
          }}>
            <DataTableWithSearchSection 
              columns={columns}
              data={data}
              enableRowActions={true}
              renderRowActions={(props) => renderRowActions({ ...props })}
            />
          </Card.Body>
        </Card>
      </Col>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          style={{
            background: "#213046",
            color: "#fff",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
          }}
          closeButton
        >
          <Modal.Title>Edit Scenario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formScenarioName">
              <Form.Label>Scenario Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={scenarioForm.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formScenarioTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                name="time"
                value={scenarioForm.time}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveScenario}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddVehicleModal} onHide={handleCloseAddVehicleModal}>
        <Modal.Header
          style={{
            background: "#213046",
            color: "#fff",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
          }}
          closeButton
        >
          <Modal.Title>Add Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectScenario">
              <Form.Label>Select Scenario</Form.Label>
              <Form.Control
                as="select"
                onChange={handleScenarioChange}
                value={selectedScenario || ""}
              >
                <option value="">--Select--</option>
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formVehicleName">
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={vehicleForm.name}
                onChange={handleVehicleInputChange}
              />
            </Form.Group>
            <Form.Group as={Col} className="mt-3">
                <Form.Label>Position X</Form.Label>
                <Form.Control
                  type="number"
                  name="positionX"
                  value={vehicleForm.positionX}
                  onChange={handleChange}
                  required
                />
                {positionXError  && (
                  <Form.Text className="text-danger">
                    {positionXError}
                    
                  </Form.Text>
                )}
              </Form.Group>
            <Form.Group controlId="formVehiclePositionY">
              <Form.Label>Position Y</Form.Label>
              <Form.Control
                type="text"
                name="positionY"
                value={vehicleForm.positionY}
                onChange={handleChange}
              />  {positionYError  && (
                <Form.Text className="text-danger">
                  {positionYError}
                  
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="formVehicleSpeed">
              <Form.Label>Speed</Form.Label>
              <Form.Control
                type="text"
                name="speed"
                value={vehicleForm.speed}
                onChange={handleVehicleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formVehicleDirection">
              <Form.Label>Direction</Form.Label>
              <Form.Control
                as="select"
                name="direction"
                value={vehicleForm.direction}
                onChange={handleVehicleInputChange}
              >
                <option value="Towards">Towards</option>
                <option value="Backwards">Backwards</option>
                <option value="Upwards">Upwards</option>
                <option value="Downwards">Downwards</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddVehicleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveVehicle}>
            Add Vehicle
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default AllScenarios;
