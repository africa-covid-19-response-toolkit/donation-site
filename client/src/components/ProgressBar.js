import React from "react";
import { LinearProgress, CardContent, Card } from "@material-ui/core";

const DonationProgress = ({ langCode, lang }) => {
  const DONATED_AMOUNT = 100;
  const DONATE_GOAL_AMOUNT = 25000;

  return (
    <Card>
      <CardContent>
        <h2>
          ${DONATED_AMOUNT}{" "}
          <h6 style={{ display: "inline" }}>
            {" "}
            raised of ${DONATE_GOAL_AMOUNT} goal
          </h6>
        </h2>
        <LinearProgress
          variant="determinate"
          value={(DONATED_AMOUNT / DONATE_GOAL_AMOUNT) * 100}
        />
      </CardContent>
    </Card>
  );
};
export default DonationProgress;
