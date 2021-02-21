import { GetServerSideProps } from "next"
import { CarModel } from "../../../../../api/Car";
import { openDB } from "../../../../openDB";
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Button } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";

const useStyles = makeStyles((theme) => ({

  paper: {
    padding: theme.spacing(2),
    margin: 'auto',

  },
  img: {
    width: '100%'
  }
}));
interface CarDetailsProps {
  car: CarModel | null | undefined;
}
export default function CarDetails({ car }: CarDetailsProps) {
  const classes = useStyles();
  const router = useRouter()
  if (!car) {
    return <div >Sorry, car not found!</div>
  }
  return ( //make, model, year, kilometers, fuelType, price, photoUrl, details
    <div>
      <Head>
        <title>{car.make+ ' '+ car.model}</title>
      </Head>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={5}>
            <img className={classes.img} alt="complex" src={car.photoUrl} />
          </Grid>
          <Grid item xs={12} sm={6} md={7} container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5">
                  {car.make + " " + car.model}
                </Typography>
                <Typography gutterBottom variant="h4">${car.price}</Typography>
                <Typography variant="body2" gutterBottom>
                  Year: {car.year}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Fuel Type: {car.fuelType}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary">
                  KMs: {car.kilometers}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary">
                  Details: {car.details}
                </Typography>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => router.back()}>back</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params.id;
  const db = await openDB()
  const car = await db.get<CarModel | undefined>('SELECT * FROM Car where id = ?', id);
  return { props: { car: car || null } }
}