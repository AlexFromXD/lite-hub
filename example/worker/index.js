exports.handler = async (event) => {
  console.log(event);
  if (typeof event.a === "number" && typeof event.b === "number") {
    return {
      ans: event.a + event.b,
    };
  } else {
    return {
      err: "Invalid input",
    };
  }
};
