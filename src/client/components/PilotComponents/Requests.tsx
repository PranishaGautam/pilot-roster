import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import _ from 'lodash';

import Spinner from '../Spinner';
import SchedulesTable from '../SchedulesTable';

import dashboardStyles from '../../../styles/dashboard.module.css';
import DisplayCard from '../DisplayCard';
import { useAuth } from '../../context/AuthContext';
import isLoading from '../../hooks/isLoading';
import { useBackendActions } from '../../hooks/callBackend';
import { PilotResponse, PilotRequests, FlightDetails } from '../../models/response-interface';
import { useToast } from '../../hooks/useToast';
import { UpdatePilotRequestPayload, UpdateRequestPayload } from '../../models/requests-interface';


const Requests = () => {
  return (
    <div>Requests</div>
  )
}

export default Requests