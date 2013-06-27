// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

namespace MyTrivia.Model
{
    using System.Collections.Generic;

    public class TriviaStepModel
    {
        public TriviaStepModel()
        {
            this.Answers = new List<AnswerModel>();
        }

        public string Question { get; set; }

        public IList<AnswerModel> Answers { get; set; }

        public int CorrectAnswer { get; set; }
    }
}
