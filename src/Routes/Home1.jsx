import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Container, Form, Button, Card, Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import ModeEditOutlineSharpIcon from "@mui/icons-material/ModeEditOutlineSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Home1.css"; // Ensure this is imported to apply custom styles

const Home = () => {
  const [scenarios, setScenarios] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({
    id: "",
    name: "",
    positionX: "",
    positionY: "",
    speed: "",
    direction: "",
  });
  const intervalRef = useRef(null);
  const [positionXError, setPositionXError] = useState("");
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

  const handleScenarioChange = (e) => {
    setSelectedScenario(e.target.value);
  };

  const handleInputChange = (e) => {
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
    setVehicleForm({ ...vehicleForm, [name]: value });
  };




  const startSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setVehicles((prevVehicles) => {
        return prevVehicles.map((vehicle) => {
          if (vehicle.scenarios_id === parseInt(selectedScenario)) {
            let { positionX, positionY, speed, direction } = vehicle;
            positionX = parseInt(positionX);
            positionY = parseInt(positionY);
            speed = parseInt(speed);
            switch (direction) {
              case "Towards":
                positionX += speed;
                break;
              case "Backwards":
                positionX -= speed;
                break;
              case "Upwards":
                positionY -= speed;
                break;
              case "Downwards":
                positionY += speed;
                break;
              default:
                break;
            }
            if (
              positionX < 0 ||
              positionY < 0 ||
              positionX > 800 ||
              positionY > 800
            ) {
              return { ...vehicle, hide: true };
            }
            return { ...vehicle, positionX, positionY };
          }
          return vehicle;
        });
      });
    }, 1000);
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditVehicleId(vehicle.id);
    setVehicleForm(vehicle);
  };

  const handleDeleteVehicle = (id) => {
    axios
      .delete(`http://localhost:5000/vehicleDelete/${id}`)
      .then(() => {
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the vehicle!", error);
      });
  };

  const handleSaveVehicle = () => {
    axios
      .put(`http://localhost:5000/vehicleEdit/${editVehicleId}`, vehicleForm)
      .then((response) => {
        setVehicles(
          vehicles.map((vehicle) =>
            vehicle.id === editVehicleId ? response.data : vehicle
          )
        );
        setEditVehicleId(null);
        setVehicleForm({
          id: "",
          name: "",
          positionX: "",
          positionY: "",
          speed: "",
          direction: "",
        });
      })
      .catch((error) => {
        console.error("There was an error updating the vehicle!", error);
      });
  };

  

  const getVehicleColor = (vehicle) => {
    // Define color based on speed or direction
    if (vehicle.speed < 5) {
      return "blue"; // Slow speed
    } else if (vehicle.speed < 10) {
      return "green"; // Moderate speed
    } else {
      return "red"; // High speed
    }
  };

  return (
    <Container>
      <Card className="mt-3" style={{ backgroundColor: "#2E2C2C" }}>
        <Card.Body>
          <h4 style={{ color: "white" }}>Scenario</h4>
          <hr style={{ color: "white" }} />
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
          <Button variant="primary" onClick={startSimulation} className="mt-3">
            Start Simulation
          </Button>{" "}
          <Button variant="secondary" onClick={stopSimulation} className="mt-3">
            Stop Simulation
          </Button>
        </Card.Body>
      </Card>
      <Table striped bordered hover className="mt-3 table-custom">
        <thead style={{ backgroundColor: "#2E2C2C" }}>
          <tr>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>
              Vehicle Id
            </th>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>
              Vehicle Name
            </th>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>
              Position X
            </th>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>
              Position Y
            </th>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>
              Speed
            </th>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>
              Direction
            </th>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>Edit</th>
            <th style={{ backgroundColor: "#2E2C2C", color: "white" }}>
              Delete
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "#2E2C2C" }}>
          {vehicles
            .filter(
              (vehicle) => vehicle.scenarios_id === parseInt(selectedScenario)
            )
            .map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.name}</td>
                <td>{vehicle.positionX}</td>
                <td>{vehicle.positionY}</td>
                <td>{vehicle.speed}</td>
                <td>{vehicle.direction}</td>
                <td>
                  <IconButton onClick={() => handleEditVehicle(vehicle)}>
                    <ModeEditOutlineSharpIcon />
                  </IconButton>
                </td>
                <td>
                  <IconButton onClick={() => handleDeleteVehicle(vehicle.id)}>
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {editVehicleId && (
        <Card className="mt-3">
          <Card.Body>
            <Form.Group controlId="editVehicleForm">
              <Form.Label className="mt-3">Vehicle Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={vehicleForm.name}
                onChange={handleInputChange}
              />
              <Form.Group>
              <Form.Label className="mt-3">Position X</Form.Label>
              <Form.Control
                type="number"
                name="positionX"
                value={vehicleForm.positionX}
                onChange={handleInputChange}
              />{positionXError  && (
                <Form.Text className="text-danger">
                  {positionXError}
                  
                </Form.Text>
              )}
              </Form.Group>
              <Form.Group>
              <Form.Label className="mt-3">Position Y</Form.Label>
              <Form.Control
                type="number"
                name="positionY"
                value={vehicleForm.positionY}
                onChange={handleInputChange}
              />{positionYError  && (
                <Form.Text className="text-danger">
                  {positionYError}
                  
                </Form.Text>
              )}
              </Form.Group>
              <Form.Label className="mt-3">Speed</Form.Label>
              <Form.Control
                type="number"
                name="speed"
                value={vehicleForm.speed}
                onChange={handleInputChange}
              />
              <Form.Label className="mt-3">Direction</Form.Label>
              <Form.Control
                as="select"
                name="direction"
                value={vehicleForm.direction}
                onChange={handleInputChange}
              >
                <option value="Towards">Towards</option>
                <option value="Backwards">Backwards</option>
                <option value="Upwards">Upwards</option>
                <option value="Downwards">Downwards</option>
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleSaveVehicle}
              className="mt-3"
            >
              Save
            </Button>
          </Card.Body>
        </Card>
      )}
      <div className="simulation-container">
        <div className="grid">
          {[...Array(100)].map((_, index) => (
            <div key={index}></div>
          ))}
          {vehicles
            .filter(
              (vehicle) => vehicle.scenarios_id === parseInt(selectedScenario)
            )
            .map(
              (vehicle) =>
                !vehicle.hide && (
                  <div
                    key={vehicle.id}
                    className="vehicle"
                    style={{
                      left: `${vehicle.positionX}px`,
                      top: `${vehicle.positionY}px`,
                      backgroundColor: getVehicleColor(vehicle),
                      textAlign: "center",
                    }}
                  >
                    {vehicle.id}
                  </div>
                )
            )}
        </div>
      </div>
    </Container>
  );
};

export default Home;

