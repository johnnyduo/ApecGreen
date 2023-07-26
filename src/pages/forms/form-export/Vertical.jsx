import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import Fileinput from "@/components/ui/Fileinput";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "@/components/ui/Select";
import * as yup from "yup";
import { useAccount, useContract, useContractWrite, useNetwork, usePrepareContractWrite, useSigner } from "wagmi";
import EarthRegistrarControllerABI from "./EarthRegistrarControllerABI.json"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"

import botthinking from "../../../assets/images/botthinking.gif"

const steps = [
  {
    id: 1,
    title: "Company Profile",
  },
  {
    id: 2,
    title: "Current Emission",
  },
  {
    id: 3,
    title: "Export Solution",
  },
  {
    id: 4,
    title: "DID Generation",
  },
];

let stepSchema = yup.object().shape({
  product: yup.string().required("Product is required"),
  quantity: yup.number().required("Quantity is required"),
  origination: yup.string().required("Origination is required"),
  country: yup.string().required("Country is required"),
  weight: yup.string().required("Weight is required"),
  year: yup.number().required("Country is required"),
});

let personalSchema = yup.object().shape({
  fname: yup.string().required(" Carbon emission is required"),
  // cname: yup.string().required(" Carbon emission is required"),
  // lname: yup.string().required(" Last name is required"),
});
let addressSchema = yup.object().shape({
  address: yup.string().required(" Solution Detail is required"),
});
// const url =
//   /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

let socialSchema = yup.object().shape({
  domainName: yup
    .string()
    .required("Domain Name is required")
    // .matches(url, "Domain Name is required"),
});
const FormWizard = () => {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { chain } = useNetwork()
  const navigate = useNavigate()

  const [stepNumber, setStepNumber] = useState(0);

  // find current step schema
  let currentStepSchema;
  switch (stepNumber) {
    case 0:
      currentStepSchema = stepSchema;
      break;
    case 1:
      currentStepSchema = personalSchema;
      break;
    case 2:
      currentStepSchema = addressSchema;
      break;
    case 3:
      currentStepSchema = socialSchema;
      break;
    default:
      currentStepSchema = stepSchema;
  }
  useEffect(() => {
    // console.log("step number changed");
  }, [stepNumber]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(currentStepSchema),
    // keep watch on all fields
    mode: "all",
  });

  const registrar = useContract({
    address: '0x838Ea5417b33Ba5Ba8e144F49739A81Ad2249Fb5',
    abi: EarthRegistrarControllerABI,
    signerOrProvider: signer,
  })

  const [minting, setMinting] = useState(false)

  const [carbonFootprint, setCarbonFootprint] = useState("")
  const [carbonReduction, setCarbonReduction] = useState("")
  const [beneficialPolicies, setBeneficialPolicies] = useState("")
  const [resistingPolicies, setResistingPolicies] = useState("")

  const onSubmit = async (data) => {
    const queryText = `I want to export ${data.quantity} ${data.product} weight ${data.weight} kg in ${data.year} from ${data.origination} to ${data.country}.`
    const promises = []

    try {
      setMinting(true)

      promises.push(
        axios.post(
          'https://chatgpt.chom.business/v1/chat/completions',
          {
            "model": "gpt-3.5-turbo",
            "max_tokens": 500,
            "messages": [
              {
                "role": "user",
                "content": `${queryText} Please list any factor required to estimate carboon footprint. Please give answer in list of no more than 50 words each and at most 10 bullets`
              }
            ]
          }
        ).then(carbonFootprintResponse => (
          setCarbonFootprint(carbonFootprintResponse.data.choices[0].message.content)
        )).catch(err => {
          console.error(err)
          toast.error("Error generating response for carbon footprint")
        })
      );

      promises.push(
        axios.post(
          'https://chatgpt.chom.business/v1/chat/completions',
          {
            "model": "gpt-3.5-turbo",
            "max_tokens": 500,
            "messages": [
              {
                "role": "user",
                "content": `${queryText} Please estimate carbon reduction and show how to estimate it. Please give answer in summarized form in at most two paragraphs`
              }
            ]
          }
        ).then(carbonReductionResponse => (
          setCarbonReduction(carbonReductionResponse.data.choices[0].message.content)
        )).catch(err => {
          console.error(err)
          toast.error("Error generating response for carbon reduction")
        })
      );

      promises.push(
        axios.post(
          'https://chatgpt.chom.business/v1/chat/completions',
          {
            "model": "gpt-3.5-turbo",
            "max_tokens": 500,
            "messages": [
              {
                "role": "user",
                "content": `${queryText} Please list any beneficial policies of that country that support our product. Please give answer in list of no more than 50 words each and at most 10 bullets`
              }
            ]
          }
        ).then(beneficialPoliciesResponse => (
          setBeneficialPolicies(beneficialPoliciesResponse.data.choices[0].message.content)
        )).catch(err => {
          console.error(err)
          toast.error("Error generating response for beneficial policies")
        })
      );

      promises.push(
        axios.post(
          'https://chatgpt.chom.business/v1/chat/completions',
          {
            "model": "gpt-3.5-turbo",
            "max_tokens": 500,
            "messages": [
              {
                "role": "user",
                "content": `${queryText} Please list any resisting policies of that country that prevent our product from success in the particular country. Please give answer in list of no more than 50 words each and at most 10 bullets`
              }
            ]
          }
        ).then(resistingPoliciesResponse => (
          setResistingPolicies(resistingPoliciesResponse.data.choices[0].message.content)
        )).catch(err => {
          console.error(err)
          toast.error("Error generating response for resisting policies")
        })
      );

      await Promise.all(promises)

      window.sessionStorage.setItem("APEC_GREEN_EXPORT", JSON.stringify({
        queryText,
        carbonFootprint,
        beneficialPolicies,
        resistingPolicies,
      }))
    } catch (err) {
      console.error(err)
      toast.error("Internal server error")
    } finally {
      setMinting(false)
    }
  };

  const handlePrev = () => {
    setStepNumber(stepNumber - 1);
  };

  const [selectedFile, setSelectedFile] = useState()

  return (
    <div>
      <Card title="Export AI Assistant (Powered By GPT3.5 Turbo)">
        <div className="grid gap-5 grid-cols-12">

          <div className="conten-box lg:col-span-12 col-span-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              {stepNumber === 0 && (
                <div>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="lg:col-span-3 md:col-span-2 col-span-1">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                        Enter Your Export Information
                      </h4>
                    </div>
                    <Textinput
                      label="Export Product"
                      type="text"
                      placeholder="For i.e, EV Car"
                      name="product"
                      error={errors.username}
                      register={register}
                    />
                    <Textinput
                      label="Quantity (Pieces)"
                      type="text"
                      placeholder="1000"
                      name="quantity"
                      error={errors.quantity}
                      register={register}
                    />
                    <Textinput
                      label="Weight (Kg)"
                      type="text"
                      placeholder="15,000"
                      name="weight"
                      error={errors.weight}
                      register={register}
                    />
                    <Textinput
                      label="Origination"
                      type="text"
                      placeholder="Your Country"
                      name="origination"
                      error={errors.origination}
                      register={register}
                    />
                    <Textinput
                      label="Destination"
                      type="text"
                      placeholder="APEC Countries"
                      name="country"
                      error={errors.country}
                      register={register}
                    />
                    <Select
                      options={["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"]}
                      label="Target export year"
                      name="year"
                      error={errors.year}
                      register={register}
                    />
                  </div>
                </div>
              )}

              {stepNumber === 1 && (
                <div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="md:col-span-2 col-span-1">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                        Enter Your Carbon Emission
                      </h4>
                    </div>
                    <Textinput
                      label="Current Carbon Emission (kg)"
                      type="text"
                      placeholder="Put amount in kg"
                      name="fname"
                      error={errors.fname}
                      register={register}
                    />
                    <Select
                      options={["Monthly", "Yearly", "Daily"]}
                      label="Period"
                    />
                  </div>
                </div>
              )}
              {stepNumber === 2 && (
                <div>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                        Specify your export solution / focused solution
                      </h4>
                    </div>
                    <Select
                      options={["Nature-Based Export Solution", "Hybrid Export Solution", "Technological Export Solution"]}
                      label="Method"
                    />
                    <Textarea
                      label="Details"
                      type="text"
                      placeholder=""
                      name="address"
                      error={errors.address}
                      register={register}
                    />
                  </div>
                </div>
              )}
              {stepNumber === 3 && (
                <div>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="lg:col-span-3 md:col-span-2 col-span-1">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                        Enter Your Digital Identity (DID)
                      </h4>
                    </div>
                    <Textinput
                      label="Domain Name (.green)"
                      type="text"
                      placeholder="companyname.green"
                      name="domainName"
                      error={errors.domainName}
                      register={register}
                      disabled={minting}
                    />
                  </div>
                </div>
              )}

              <div
                className={`${
                  stepNumber > 0 ? "flex justify-between" : " text-right"
                } mt-10`}
              >
                {stepNumber !== 0 && (
                  <Button
                    text="prev"
                    className="btn-dark"
                    onClick={handlePrev}
                    disabled={minting}
                  />
                )}
                <Button
                  text={"Submit"}
                  className="btn-dark"
                  type="submit"
                  disabled={minting}
                />
              </div>
            </form>
          </div>
        </div>
      </Card>

      {(minting || carbonFootprint || carbonReduction || beneficialPolicies || resistingPolicies) &&
        <Card title="AI Response" className="mt-8">
          <div className="mb-6">
            <h6 className="text-lg text-slate-800 dark:text-slate-300 mb-3">Carbon Footprint Factors</h6>
            {carbonFootprint ?
              <div className="whitespace-pre-line">
                {carbonFootprint}
              </div>
              :
              <div className="mb-10">
                <img src={botthinking} style={{ height: 120 }} />
              </div>
            }
          </div>

          <div className="mb-6">
            <h6 className="text-lg text-slate-800 dark:text-slate-300 mb-3">Estimated Carbon Reduction</h6>
            {carbonReduction ?
              <div className="whitespace-pre-line">
                {carbonReduction}
              </div>
              :
              <div className="mb-10">
                <img src={botthinking} style={{ height: 120 }} />
              </div>
            }
          </div>

          <div className="mb-6">
            <h6 className="text-lg text-slate-800 dark:text-slate-300 mb-3">Beneficial Policies</h6>
            
            {beneficialPolicies ?
              <div className="whitespace-pre-line">
                {beneficialPolicies}
              </div>
              :
              <div className="mb-10">
                <img src={botthinking} style={{ height: 120 }} />
              </div>
            }
          </div>

          <div className="mb-6">
            <h6 className="text-lg text-slate-800 dark:text-slate-300 mb-3">Resisting Policies</h6>
            {resistingPolicies ?
              <div className="whitespace-pre-line">
                {resistingPolicies}
              </div>
              :
              <div className="mb-10">
                <img src={botthinking} style={{ height: 120 }} />
              </div>
            }
          </div>

          <Button
            text={"Proceed to KYB"}
            className="btn-dark w-full"
            disabled={minting}
            onClick={() => navigate("/form-kyc")}
          />
        </Card>
      }
    </div>
  );
};

export default FormWizard;
