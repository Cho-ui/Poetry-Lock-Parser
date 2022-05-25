import React from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const Input = styled('input')({
    display: 'none',
});

export default function Upload() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 100 }}>
            <label htmlFor="contained-button-file">
                <Input accept=".lock" id="contained-button-file" multiple type="file" />
                <Stack direction="row" spacing={3}>
                    <Button variant="contained" component="span">
                        Upload Poetry.lock file
                    </Button>
                    <Button variant="contained">
                        Parse
                    </Button>
                </Stack>
            </label>
        </div>
    )
}