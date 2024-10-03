import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
// import test_data from '../../../data/test_data.json'; not needed
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        break;
      default:
        break;
    }
  }
  
  async function updateStateWithNewData(years, view, office, stateSettingCallback) {
    /*
          _                                                                             _
        |                                                                                 |
        |   Sample request for the `/summary` endpoint once it is operational:           |
        |                                                                                 |
        |     `${url}/summary?to=2022&from=2015&office=ZLA`                               |
        |                                                                                 |
        |     In axios, this would translate to:                                           |
        |                                                                                 |     
        |       axios.get(`${url}/summary`, {                                             |
        |         params: {                                                               |
        |           from: <year_start>,                                                   |
        |           to: <year_end>,                                                       |
        |           office: <office>,       [ <-- optional when querying ]                |
        |         },                        [ omitting `office` queries for `all offices` ] |
        |       })                          [ no `office` parameter included in the query ] |
        |                                                                                 |
          _                                                                             _
                                   -- Mack 
    
    */
    // Modifications ⬇️
    if (office === 'all' || !office) {
      // Storing citizenshipSummary in a variable and using the appropriate endpoint
      // for when all or no offices are selected
      const citizenshipSummary = await axios
        .get("https://hrf-asylum-be-b.herokuapp.com/cases/citizenshipSummary", {
          params: {
            from: years[0],
            to: years[1],
          },
        });
      console.log(citizenshipSummary); // Outputting results to the console
      
      // Storing fiscalSummary in a variable and utilizing the correct endpoint
      const fiscalSummary = await axios
        .get("https://hrf-asylum-be-b.herokuapp.com/cases/fiscalSummary", {
          params: {
            from: years[0],
            to: years[1],
          },
        });
      console.log(fiscalSummary); // Outputting results to the console

      fiscalSummary.data["citizenshipResults"] = citizenshipSummary.data;
      // Creating a variable to hold combinedData
      const combinedData = [fiscalSummary.data];
      console.log(combinedData); // Outputting results to the console

      stateSettingCallback(view, office, combinedData);
      // Using combined data instead of test data
    } else {
      // Storing citizenshipSummary in a variable and using the appropriate endpoint
      // for when a specific office is selected
      const citizenshipSummary = await axios
        .get("https://hrf-asylum-be-b.herokuapp.com/cases/citizenshipSummary", {
          params: {
            from: years[0],
            to: years[1],
            office: office,
          },
        });
      console.log("Citizenship Summary Data:", citizenshipSummary);
      
      // Storing fiscalSummary in a variable and utilizing the correct endpoint
      // for when a specific office is selected
      const fiscalSummary = await axios
        .get("https://hrf-asylum-be-b.herokuapp.com/cases/fiscalSummary", {
          params: {
            from: years[0],
            to: years[1],
            office: office,
          },
        });
      console.log("Fiscal Summary Data:", fiscalSummary); // Outputting results to the console
      
      fiscalSummary.data["citizenshipResults"] = citizenshipSummary.data;
      // Creating a variable to hold combinedData
      const combinedData = [fiscalSummary.data];
      console.log("Combined Data:", combinedData); // Outputting results to the console

      stateSettingCallback(view, office, combinedData);
      // Using combined data instead of test data
    }
  }
  // Modifications ⬆️

  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
        />
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
