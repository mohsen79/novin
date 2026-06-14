import { useEffect, useState } from "react";
import "./App.css";
import Form from "./components/From/Form";
import { getSum } from "./helpers/helperFunctions";
import type { CheckedAnswers, Form as FormType } from "./types/form.types";
import Button from "./components/Button/Button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getForms, sendForms } from "./api/form.api";
// import { logger } from "./lib/betterstack.ts";
import { usePostHog } from "@posthog/react";

const storage = localStorage.getItem("checkedAnswers") as string;

function App() {
  const [checkedAnswers, setCheckedAnswers] = useState<CheckedAnswers>(
    new Map(JSON.parse(storage) ?? []),
  );
  const [total, setTotal] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
  });
  const posthog = usePostHog();

  // useEffect(() => {
  //   logger.info("User clicked button", {
  //     button: "checkout",
  //   });

  //   try {
  //     throw new Error("Test Better Stack");
  //   } catch (err: any) {
  //     logger.error(err.message, {
  //       stack: err.stack,
  //     });
  //   }
  // }, []);

  const { data: forms } = useQuery<FormType[]>({
    queryKey: ["forms"],
    queryFn: getForms,
  });

  const { mutate: sendRequest, isPending } = useMutation({
    mutationFn: sendForms,
    onSuccess: () => {
      alert("submitted correctly!");
    },
    onError: () => {
      alert("submition failed!");
    },
  });

  const result = getSum(total);

  return (
    <Button
      text="send request"
      action={() => {
        posthog.capture("button_clicked", { button_name: "signup" });
        sendRequest(result);
      }}
    />
    // <section className="app">
    //   {forms?.map((form) => (
    //     <Form
    //       key={form.id}
    //       id={Number(form.id)}
    //       setCheckedAnswers={setCheckedAnswers}
    //       questions={form.questions}
    //       setTotal={setTotal}
    //       checkedAnswers={checkedAnswers}
    //     />
    //   ))}
    //   <div>
    //     <h2>total: {result}</h2>
    //     {isPending ? (
    //       "loading"
    //     ) : (
    //       <Button
    //         text="send request"
    //         action={() => {
    //           posthog.capture("button_clicked", { button_name: "signup" });
    //           sendRequest(result);
    //         }}
    //       />
    //     )}
    //   </div>
    // </section>
  );
}

export default App;
