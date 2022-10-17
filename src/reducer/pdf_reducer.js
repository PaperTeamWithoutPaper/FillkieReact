export function setPdfPages(pages)
{
    return{
        type: 'SET_PDF_PAGES',
        pages
    }
}
const initialState={
   pages:0,
}

export default function pdf_reducer(state=initialState, action)
{
    switch (action.type)
    {
        case 'SET_PDF_PAGES':
            return{
                ...state,
                pages:action.pages
            }
  
      
        default:
            return state;
    }
}