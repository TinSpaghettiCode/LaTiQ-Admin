'use client';

import Box from './Box';
import { RiseLoader } from 'react-spinners';

const Loading = () => {
  return (
    <Box className="h-[100vh] flex items-center justify-center">
      <RiseLoader color="#c0000d" />
    </Box>
  );
};

export default Loading;
