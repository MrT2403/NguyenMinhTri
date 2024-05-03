import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";

const CurrencySwapForm = () => {
  const [formData, setFormData] = useState({
    fromCurrency: "",
    toCurrency: "",
    amountFrom: "",
    amountTo: "",
    exchangeRate: null,
    fromTokenIconUrl: null,
    toTokenIconUrl: null,
    currencyList: [],
    swappedAmount: null,
    exchangeRateAvailable: true,
    exchangeRateData: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://interview.switcheo.com/prices.json"
        );
        const data = response.data;
        const currencies = data.map((item) => item.currency);
        setFormData((prevData) => ({
          ...prevData,
          currencyList: currencies,
          exchangeRateData: data,
        }));
      } catch (error) {
        console.error("Error fetching currency list:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const { fromCurrency, toCurrency } = formData;
        if (fromCurrency) {
          const fromTokenIconUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${fromCurrency.toUpperCase()}.svg`;
          setFormData((prevData) => ({
            ...prevData,
            fromTokenIconUrl,
          }));
        }
        if (toCurrency) {
          const toTokenIconUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${toCurrency.toUpperCase()}.svg`;
          setFormData((prevData) => ({
            ...prevData,
            toTokenIconUrl,
          }));
        }
      } catch (error) {
        console.error("Error fetching token icons:", error);
      }
    };

    fetchIcons();
  }, [formData.fromCurrency, formData.toCurrency]);

  const handleSwap = () => {
    const { fromCurrency, toCurrency, amountFrom, exchangeRateData } = formData;

    const price1 = exchangeRateData.find(
      (item) => item.currency === fromCurrency
    )?.price;
    const price2 = exchangeRateData.find(
      (item) => item.currency === toCurrency
    )?.price;

    if (price1 && price2) {
      const swappedAmount = (parseFloat(amountFrom) * price1) / price2;
      setFormData((prevData) => ({
        ...prevData,
        amountTo: swappedAmount.toFixed(4),
        swappedAmount: swappedAmount.toFixed(4),
      }));
    } else {
      console.error(
        "Exchange rate not available for the selected currency pair."
      );
      setFormData((prevData) => ({
        ...prevData,
        exchangeRate: null,
        exchangeRateAvailable: false,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5rem",
        padding: "5rem",
      }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant="h5" align="center">
              From Currency
            </Typography>
            <Select
              label="From Currency"
              variant="outlined"
              fullWidth
              name="fromCurrency"
              value={formData.fromCurrency}
              onChange={handleChange}
              sx={{ mt: 1 }}
            >
              {formData.currencyList.map((currency, index) => (
                <MenuItem key={index} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ mt: 1, position: "relative" }}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                name="amountFrom"
                value={formData.amountFrom}
                onChange={handleChange}
              />
              {formData.fromTokenIconUrl && (
                <Avatar
                  alt={formData.fromCurrency}
                  src={formData.fromTokenIconUrl}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Typography variant="h5" align="center">
              &#8596;
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h5" align="center">
              To Currency
            </Typography>
            <Select
              label="To Currency"
              variant="outlined"
              fullWidth
              name="toCurrency"
              value={formData.toCurrency}
              onChange={handleChange}
              sx={{ mt: 1 }}
            >
              {formData.currencyList.map((currency, index) => (
                <MenuItem key={index} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ mt: 1, position: "relative" }}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                name="amountTo"
                value={formData.amountTo}
                InputProps={{
                  readOnly: true,
                }}
              />
              {formData.toTokenIconUrl && (
                <Avatar
                  alt={formData.toCurrency}
                  src={formData.toTokenIconUrl}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSwap}
            >
              Swap
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default CurrencySwapForm;
