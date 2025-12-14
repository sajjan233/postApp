import React, { useState } from "react";
import AddQuery from "./AddQuery";
import MyQueries from "./MyQueries";

const QueryPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <AddQuery onSuccess={() => setRefresh(!refresh)} />
      <MyQueries key={refresh} />
    </div>
  );
};

export default QueryPage;
