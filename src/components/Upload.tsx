import React from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


const Input = styled('input')({
    display: 'none',
  });

export default function Upload() {
    return(
        <label htmlFor="contained-button-file">
        <Input accept=".lock" id="contained-button-file" multiple type="file" />
        <Button variant="contained" component="span">
          Upload Poetry.lock file
        </Button>
      </label>
    )
}