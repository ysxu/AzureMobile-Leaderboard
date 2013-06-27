// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

namespace MyTrivia.Model
{
    using System.Collections.Generic;

    public class TriviaModel
    {
        public TriviaModel()
        {
            this.Steps = new List<TriviaStepModel>();
        }

        public string PlayerName { get; set; }

        public IList<TriviaStepModel> Steps { get; set; }
    }
}
