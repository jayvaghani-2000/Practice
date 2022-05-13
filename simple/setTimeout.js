import React, { useEffect, useState } from "react"
import { useStyles } from "./CourtPricingDataTableStyle"
import { DataArray } from "./DataArray"
import MoreDropDown from "../MoreDropDown/MoreDropDown"
import { useHistory } from "react-router"
import { connect, useDispatch } from "react-redux"
import { auth } from "../../Store/Actions/Auth"
import axios from "../../Store/request"
import ConfirmModal from "../ConfirmModal/ConfirmModal"
import ViewModal from "../ViewModal/ViewModal"
import { Dialog, Button } from "@material-ui/core"
import useToast from "../../Components/Toast/useToast"

const CourtPricingDataTable = props => {
  const classes = useStyles()
  const { showToast } = useToast()

  const [courtPricings, setCourtPricings] = useState([])
  const [currentData, setCurrentData] = useState({
    service: {},
    court: {}
  })
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [arrayOfData, setArrayOfData] = useState([])
  const [openEditModal, setOpenEditModal] = useState(false)

  useEffect(() => {
    axios
      .get("/api/v1/courts/pricing/court/")
      .then(function (response) {
        setCourtPricings(response.data.results)
      })
      .catch(function (error) {})
  }, [])

  const deletePricing = () => {
    axios
      .delete(`/api/v1/courts/pricing/court/${currentData.id}/`)
      .then(function (response) {
        setOpenConfirmModal(false)
        showToast("Court Pricing Deleted Succesfully", "success")
      })
      .catch(function (error) {
        setOpenConfirmModal(false)
        showToast("Unable to delete, please try again later", "error")
      })
  }

  const EditPricing = e => {
    console.log(currentData)
    e.preventDefault()
    const lastData = {
      ...currentData,
    }
    const data = JSON.stringify(lastData)
    console.log("data:>>",data)
    axios
      .put(`/api/v1/courts/pricing/court/${lastData.id}/`, data)
      .then(function (response) {
        setOpenEditModal(false)
        setCurrentData({service: {},
          court: {}})
        showToast("Court Pricing Edited Succesfully", "success")
      })
      .catch(function (error) {
        setOpenEditModal(false)
        setCurrentData({service: {},
          court: {}})
        showToast("Unable to edit, please try again later", "error")
      })
  }

  const expressionConverter = txt => {
    let origString = txt.toString()
    let stringToAdd = "/"
    let indexPosition = 2

    origString = origString.split("")

    // Insert the string at the index position
    origString.splice(indexPosition, 0, stringToAdd)

    // Join back the individual characters
    // to form a new string
    let newString = ""

    newString = origString.join("")

    // return (`$ ${newString}`)
    return `$ ${txt}`
  }

  const TextClipper = (bio, length) => {
    let vb = ""

    if (bio.length >= length) {
      for (var i = 0; i < length; i++) {
        vb += bio.charAt(i)
      }
      bio = `${vb}...`
    }

    return bio
  }

  return (
    <div className={classes.Container} style={{ minHeight: "650px" }}>
      <div className={classes.TableHeading}>
        <div className={classes.HeadingInner}>
          <p></p>
          <p className={classes.Heading1}>Service name</p>
          <p className={classes.Heading}>Court name</p>
          <p className={classes.Heading}>Price</p>
        </div>
      </div>
      {props.DataArray.map(i => {
        return (
          <div className={classes.MainContainer}>
            <div className={classes.ContainerInner}>
              <p className={classes.ListItmes}>
                {TextClipper(i.service.name, 15)}
              </p>
              <p className={classes.ListItmes}>
                {TextClipper(i.court.name, 15)}
              </p>
              <p className={classes.ListItmes}>
                {expressionConverter(i.price)}
              </p>

                {/*pricingDelete={() => {*/}
                {/*  setCurrentData(i)*/}
                {/*  setOpenConfirmModal(true)*/}
                {/*}}*/}
                <MoreDropDown
                pricingView={() => {
                  setArrayOfData([
                    {
                      title: "Service Name/ID",
                      val: i.service.name
                    },
                    {
                      title: "Court Name/ID",
                      val: i.court.name
                    },
                    {
                      title: "Price",
                      val: `$ ${i.price}`
                    }
                  ])
                  setCurrentData(i)
                  setOpenViewModal(true)
                }}
                pricingEdit={() => {
                  console.log(i.service.name)
                  setCurrentData(i)
                  setOpenEditModal(true)
                }}
              />
            </div>
          </div>
        )
      })}
      <ConfirmModal
        signal={openConfirmModal}
        handleyes={deletePricing}
        handleno={() => setOpenConfirmModal(false)}
        msg={`Are you sure you want to delete this court pricing?`}
      />

      <ViewModal
        signal={openViewModal}
        handleyes={() => setOpenViewModal(false)}
        arrayOfData={arrayOfData}
      />

      <Dialog
        open={openEditModal}
        keepMounted
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        overlayStyle={{ backgroundColor: "transparent" }}
      >
        <div className={classes.topDiv}>
          {/*<div className={classes.LogoWrapper}>
          <img src={Logo} className={classes.Logo} />
    </div>*/}
          <p
            style={{
              position: "absolute",
              top: "5%",
              left: "40%",
              fontSize: "20px",
              fontWeight: "700"
            }}
          >
            Edit Pricing
          </p>
          <form onSubmit={EditPricing} className={classes.upperDiv}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setOpenEditModal(false)}
            >
              <i
                class="fal fa-times fa-lg"
                style={{ position: "absolute", top: "3%", right: "4%" }}
              ></i>
            </div>

            {/* <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>Service Name</p>
              <input
                type="text"
                className={classes.selectCont}
                onChange={e => {
                  let service={service:{...currentData.service,name={e.target.value}}}
                  setCurrentData({ ...currentData, ...service})
                }}
                value={currentData.service.name}
                required
              />
            </div>
            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>Court Name</p>
              <input
                type="text"
                className={classes.selectCont}
                value={currentData.court.name}
                onChange={e => {
                  setCurrentData({ ...currentData, [currentData.court.name]: e.target.value })
                }}
                required
              />
            </div> */}
            <div className={classes.firstDiv}>
              <p style={{ fontWeight: 600 }}>Pricing</p>
              <input
                type="text"
                className={classes.selectCont}
                value={currentData.price}
                onChange={e => {
                  setCurrentData({ ...currentData, price: e.target.value })
                }}
                required
              />
            </div>

            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              disabled={currentData.pricing === ""}
              type="submit"

              // startIcon={<AddIcon />}
            >
              {"SAVE PRICING"}
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    redirectTo: state.auth.redirectTo,
    invalidUser: state.auth.invalidUser,
    accessToken: state.auth.accessToken
  }
}

export default connect(mapStateToProps, { auth })(CourtPricingDataTable)
