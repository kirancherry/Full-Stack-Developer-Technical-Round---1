import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Form, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddVehicle = () => {
  const [vehicle, setVehicle] = useState({
    scenarios_id: "",
    id: "",
    name: "",
    positionX: "",
    positionY: "",
    speed: "",
    direction: "",
  });
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [positionXError, setPositionXError] = useState("");
  const [positionYError, setPositionYError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/scenarios")
      .then((response) => {
        setScenarios(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the scenarios!", error);
      });
  }, []);

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
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  const handleScenarioChange = (e) => {
    const selectedScenarioId = parseInt(e.target.value); // Parse the value to an integer
    setSelectedScenario(selectedScenarioId);
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      scenarios_id: selectedScenarioId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (positionXError !== "") {
      // Prevent form submission if there are validation errors
      return;
    }

    axios
      .post("http://localhost:5000/vehicles", vehicle)
      .then((response) => {
        console.log("Vehicle added:", response.data);

        // Reset the form after successful submission
        handleReset();
      })
      .catch((error) => {
        console.error("There was an error adding the vehicle!", error);
      });
  };

  const handleReset = () => {
    setVehicle({
      scenarios_id: "",
      id: "",
      name: "",
      positionX: "",
      positionY: "",
      speed: "",
      direction: "",
    });
    setSelectedScenario("");
    setPositionXError("");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div>
      <h5 style={{ color: "white", marginBottom: "1rem" }}>Vehicle / add</h5>

      <Container
        className="mt-5"
        style={{ backgroundColor: "#2c2f33", border: "5px solid #444" }}
      >
        <h2 style={{ color: "white" }}>Add Vehicle</h2>
        <Form onSubmit={handleSubmit}>
          <Card
            className="p-3"
            style={{ backgroundColor: "#2c2f33", color: "white" }}
          >
            <Row>
              <Form.Group controlId="selectScenario" as={Col} className="mt-3">
                <Form.Label>Scenarios List</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleScenarioChange}
                  value={selectedScenario || ""}
                  style={{ backgroundColor: "#2c2f33", color: "white" }}
                >
                  <option value="">--Select--Scenario</option>
                  {scenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </option>
                  ))}
                </Form.Control>
                {vehicle.scenarios_id === "" && (
                  <Form.Text className="text-danger">
                    Scenarios Required
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} className="mt-3">
                <Form.Label>Vehicle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={vehicle.name}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "#2c2f33", color: "white" }}
                />
                {vehicle.name === "" && (
                  <Form.Text className="text-danger">
                    Vehicle Name is Required
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} className="mt-3">
                <Form.Label>Speed</Form.Label>
                <Form.Control
                  type="number"
                  name="speed"
                  value={vehicle.speed}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "#2c2f33", color: "white" }}
                />
                {vehicle.speed === "" && (
                  <Form.Text className="text-danger">
                    Speed is Required
                  </Form.Text>
                )}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} className="mt-3">
                <Form.Label>Position X</Form.Label>
                <Form.Control
                  type="number"
                  name="positionX"
                  value={vehicle.positionX}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "#2c2f33", color: "white" }}
                />
                {positionXError  && (
                  <Form.Text className="text-danger">
                    {positionXError}
                    
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group as={Col} className="mt-3">
                <Form.Label>Position Y</Form.Label>
                <Form.Control
                  type="number"
                  name="positionY"
                  value={vehicle.positionY}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "#2c2f33", color: "white" }}
                />
                {positionYError && (
                  <Form.Text className="text-danger">
                    {positionYError}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} className="mt-3">
                <Form.Label>Direction</Form.Label>
                <Form.Control
                  as="select"
                  name="direction"
                  value={vehicle.direction}
                  onChange={handleChange}
                  required
                  style={{ backgroundColor: "#2c2f33", color: "white" }}
                >
                  <option value="">--Select--Direction</option>
                  <option value="Towards">Towards</option>
                  <option value="Backwards">Backwards</option>
                  <option value="Upwards">Upwards</option>
                  <option value="Downwards">Downwards</option>
                </Form.Control>
                {vehicle.direction === "" && (
                  <Form.Text className="text-danger">
                    Direction will be Required
                  </Form.Text>
                )} 
              </Form.Group>
            </Row>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="success" type="submit">
                Add
              </Button>
              <Button variant="warning" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="info" onClick={handleGoBack}>
                Go Back
              </Button>
            </div>
          </Card>
        </Form>
      </Container>
    </div>
  );
};

export default AddVehicle;
