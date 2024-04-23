const DataAPI = async () => {
    try {
      let data = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1shqnWtN7MbP01cANKpFVqAfBb6PBVY7O-1LtPUvNePI/values/Emission.Budget?key=AIzaSyDBU-2zweaqXe16p3J7vAYYh9C5NabusSM"
      );
      let { values } = await data.json();
      let [, ...Data] = values.map((data) => data);
      return Data;
    } catch {
      console.log("Error");
    }
  };
  export default DataAPI;