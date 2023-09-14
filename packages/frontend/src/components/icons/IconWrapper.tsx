import * as React from 'react';
import SvgIcon from '../svgIcon/SvgIcon';

export interface IIconWrapperProps {
  className?: string;
  fill?: string;
  size?: string;
  children?: JSX.Element;
}

const IconWrapper = (props: IIconWrapperProps): JSX.Element => {
  return (
    <SvgIcon {...props} size="125">
      <g id="iconWrapper" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        {props.children ? (
          <>
            <path
              d="M26.5999095,22 L16.3998549,22 C15.9009373,22 15.4381369,21.7248603 15.1881907,21.2757288 C14.9372698,20.8276072 14.9372698,20.2742981 15.1881907,19.8251665 L20.2885929,10.6736973 C20.7884853,9.77543424 22.2129787,9.77543424 22.7128711,10.6736973 L27.8132733,19.8251665 C28.0622422,20.2742981 28.0622422,20.8276072 27.8132733,21.2757288 C27.5623523,21.7248603 27.1005267,22 26.5996595,22 L26.5999095,22 Z M18.8260827,19.0999631 L24.1754313,19.0999631 L21.5002571,14.2991966 L18.8260827,19.0999631 Z"
              id="Shape"
              fill="#00ADEF"
              fillRule="nonzero"
            ></path>
            <path
              d="M104.501023,111 C100.916686,111 98,108.084645 98,104.5 C98,100.915355 100.916686,98 104.501023,98 C108.08536,98 111,100.915355 111,104.5 C111,108.084645 108.085104,111 104.501023,111 Z M104.501023,100.865209 C102.496562,100.865209 100.865781,102.496221 100.865781,104.5 C100.865781,106.504776 102.496537,108.134791 104.501023,108.134791 C106.50551,108.134791 108.135242,106.504776 108.135242,104.5 C108.135242,102.496221 106.506482,100.865209 104.501023,100.865209 Z"
              id="Shape"
              fill="#00ADEF"
              fillRule="nonzero"
            ></path>
            <path
              d="M62.044893,124 C72.134006,123.998216 82.072385,121.545594 91,116.852623 L89.1272617,113.317648 L89.1272617,113.31854 C77.8219839,119.268635 64.8657229,121.327678 52.2694851,119.17659 C39.6723324,117.024611 28.1383232,110.78191 19.4556796,101.417437 C10.7737221,92.0529634 5.42895564,80.0895061 4.25030277,67.3810021 C3.07181002,54.6743254 6.12482516,41.9347588 12.9368349,31.1359222 L9.55138153,29 C1.62881228,41.5575304 -1.51715929,56.5361197 0.68529529,71.2132187 C2.887727,85.8907745 10.2920138,99.2906507 21.5524602,108.977171 C32.8122205,118.66369 47.1795255,123.993675 62.0424913,123.996415 L62.044893,124 Z"
              id="Path"
              fill="#99A5B3"
              fillRule="nonzero"
            ></path>
            <path
              d="M62.9574224,3.99866888 C76.8616424,4.00134554 90.303799,8.9870005 100.837472,18.0482227 C111.371374,27.1094448 118.298894,39.644912 120.359423,53.3753862 C122.420797,67.1063171 119.477499,81.1172707 112.066528,92.8640608 L115.452172,95 L115.452172,95 C122.732644,83.4567174 125.99591,69.8367905 124.735072,56.2536366 C123.474233,42.6704827 117.760201,29.8821729 108.479132,19.8712491 C99.1980621,9.86169577 86.8680601,3.18888861 73.4034866,0.887952131 C59.9370832,-1.41298435 46.0868468,0.787132558 34,7.14757742 L35.8728436,10.6825778 L35.8728436,10.6816857 C44.2238392,6.29199952 53.520006,3.99814355 62.9584517,3.99722993 L62.9574224,3.99866888 Z"
              id="Path"
              fill="#99A5B3"
              fillRule="nonzero"
            ></path>
            {props.children}
          </>
        ) : (
          <>
            {/* <g fill="#00ADEF" transform="translate(37, 34)">
              <path d="M26,0 L0,14.2530151 L0,42.749397 L26,57 L52,42.749397 L52,14.2530151 L26,0 Z M6,15.3800695 L25.775117,4 L46,15.6368903 L26.2516258,27 L6,15.3800695 Z M4,41.1973626 L4,20 L24,30.7745055 L24,52 L4,41.1973626 Z M48,20 L48,41.0269385 L28,52 L28,30.9492484 L28.0100226,30.9682989 L48,20 Z"></path>
            </g> */}

            <g transform="translate(16.175884, 6.000000)" fill="#99A5B3">
              <path
                d="M29.5,0 L0,16.5034912 L0,49.4993018 L29.5,66 L59,49.4993018 L59,16.5034912 L29.5,0 Z M6.04876857,17.9558207 L29.5,4.83737464 L53.4846071,18.2518725 L30.0650899,31.3507681 L6.04876857,17.9558207 Z M4.32466771,47.0834074 L4.32466771,21.8296306 L27.3376661,34.6659896 L27.3376661,59.9532817 L4.32466771,47.0834074 Z M54.6782154,22.4217342 L54.6782154,47.0834074 L31.665217,59.9532817 L31.665217,35.2636791 L31.6767494,35.2860226 L54.6782154,22.4217342 Z"
              ></path>
            </g>
            <g transform="translate(72.175884, 5.000000)" fill="#99A5B3" stroke="#99A5B3" strokeWidth="1.5">
              <path
                d="M19,0 L0,10.5022217 L0,31.4995557 L19,42 L38,31.4995557 L38,10.5022217 L19,0 Z M3.89581704,11.4264314 L19,3.07832931 L34.4477131,11.614828 L19.3639562,19.9504888 L3.89581704,11.4264314 Z M2.7853792,29.9621683 L2.7853792,13.8915831 L17.6073104,22.0601752 L17.6073104,38.1520884 L2.7853792,29.9621683 Z M35.2164777,14.2683763 L35.2164777,29.9621683 L20.3945465,38.1520884 L20.3945465,22.440523 L20.4019742,22.4547417 L35.2164777,14.2683763 Z"
              ></path>
            </g>
            {/* <path
              d="M93.5010232,72 C89.9166863,72 87,69.0846454 87,65.5 C87,61.9153546 89.9166863,59 93.5010232,59 C97.0853601,59 100,61.9153546 100,65.5 C100,69.0846454 97.0851043,72 93.5010232,72 Z M93.5010232,61.865209 C91.4965624,61.865209 89.8657812,63.4962214 89.8657812,65.5 C89.8657812,67.5047764 91.4965368,69.134791 93.5010232,69.134791 C95.5055096,69.134791 97.135242,67.5047764 97.135242,65.5 C97.135242,63.4962214 95.5064817,61.865209 93.5010232,61.865209 Z"
              fill="#00ADEF"
              fillRule="nonzero"
            ></path>
            <path
              d="M11.5999095,12 L1.39985494,12 C0.900937332,12 0.438136945,11.7248603 0.188190744,11.2757288 C-0.0627302479,10.8276072 -0.0627302479,10.2742981 0.188190744,9.82516654 L5.28859293,0.673697295 C5.78848533,-0.224565765 7.21297873,-0.224565765 7.71287113,0.673697295 L12.8132733,9.82516654 C13.0622422,10.2742981 13.0622422,10.8276072 12.8132733,11.2757288 C12.5623523,11.7248603 12.1005267,12 11.5996595,12 L11.5999095,12 Z M3.82608272,9.0999631 L9.17543133,9.0999631 L6.50025713,4.29919659 L3.82608272,9.0999631 Z"
              fill="#00ADEF"
              fillRule="nonzero"
            ></path> */}
          </>
        )}
      </g>
    </SvgIcon>
  );
};

export default IconWrapper;