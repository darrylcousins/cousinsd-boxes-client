import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Get({ url, children }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          setResponse(result);
          setLoading(false);
        },
        (err) => {
          setError(err);
        },
      );
  }, [url]);

  if (typeof children === 'function') {
    return children({ response, error, loading });
  }
  return { response, error, loading };
}

Get.propTypes = {
  url: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};
